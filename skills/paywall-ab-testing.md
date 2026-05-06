# Paywallo: A/B Testing & Remote Config

This guide documents the implementation of A/B tests using Paywallo variants and remote configuration patterns.

## 1. Core Concept

Paywallo allows you to define "experiments" with multiple variants (e.g., `A`, `B`, `Control`). The SDK provides a method to fetch the variant assigned to the current user.

## 2. Implementation Pattern

To avoid layout shifts or laggy UI updates, load variants during app initialization and store them in a global state (e.g., Zustand).

### Fetching a Variant
```typescript
import { PaywalloClient } from "@virex-tech/paywallo-sdk";

const variant = await PaywalloClient.getVariant("welcome_screen_version");
console.log("Assigned variant:", variant?.variant); // e.g., "video" or "image"
```

### State Management (Zustand + Persistence)
In mobile apps, it's crucial to persist variants so they are available immediately on the next launch even without network.

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PaywalloClient } from "@virex-tech/paywallo-sdk";

interface IAbTestState {
  welcomeVariant: string | null;
  fetchVariantsFromServer: () => Promise<void>;
}

export const useAbTestStore = create<IAbTestState>()(
  persist(
    (set, get) => ({
      welcomeVariant: null,
      fetchVariantsFromServer: async () => {
        try {
          const res = await PaywalloClient.getVariant("welcome_screen_version");
          if (res?.variant) {
            set({ welcomeVariant: res.variant });
          }
        } catch (e) {
          // Fallback if never loaded
          const state = get();
          if (!state.welcomeVariant) {
            set({ welcomeVariant: "control" });
          }
        }
      },
    }),
    {
      name: "ab-test-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

## 3. Usage Pattern (Recommended)

To keep components clean, combine the store value with local logic in a dedicated hook.

```typescript
// src/features/onboarding/hooks/useWelcomeAbTest.ts
export const useWelcomeAbTest = () => {
  const variant = useAbTestStore(s => s.welcomeVariant) || "control";
  
  return {
    variant,
    isVideoButton: variant === "video_cta",
    // any other derived logic
  };
};
```

## 4. Tracking and Correlation

While the Paywallo dashboard correlates variants automatically, you should pass the variant to standard tracking hooks if you need it in external tools like AppsFlyer or Hotfy.

```typescript
const { variant } = useWelcomeAbTest();

const { trackStepViewed } = useOnboardingTracking({
  currentStepIndex,
  currentStep,
  totalSteps,
  abTestVariant: variant, // If the tracking hook supports it
});
```

## 5. Past Experiments (History)

- **`quiz_progress_bar`**: Concluded. The `no_progress` variant performed significantly better. The progress bar was permanently removed from the UI and logic was hardcoded to `false` in April 2026.

## 6. Best Practices

- **Naming Conventions**: Use `snake_case` for experiment IDs (e.g., `checkout_button_color`) and values (e.g., `primary_blue`).
- **Fallbacks**: Always define a default value (e.g., `"control"`) in your store or hook. The user should never see a broken UI if the SDK fails to load.
- **Store Structure**: Keep `abTestStore.ts` as the single source of truth for all active variant states.
- **Initialization**: Always call `fetchVariantsFromServer` during the app boot sequence (handled in `useAppInitialization.ts`).
