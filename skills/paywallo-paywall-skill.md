# Paywallo Paywall Implementation Skill (FitCal Standard)

This document serves as a "Skill" for AI assistants to implement the **Paywall** functionality of Paywallo exactly as configured in the FitCal project.

## 1. Paywall Presentation Logic

The project uses a hybrid approach: deciding between a **Remote Panel (Paywallo UI)** or a **Custom Local UI** based on feature flags.

### Core Logic for Display
```javascript
import { usePaywallo } from "@virex-tech/paywallo-sdk";
import { paywalloService } from "@/app/services/paywalloService";

const PaywallScreen = () => {
  const { presentCampaign } = usePaywallo();

  const handleShowPaywall = async () => {
    // 1. Check feature flag to decide mode
    // Tip: Use getSessionFlag (synch) if flag was preloaded in PaywalloProvider
    const isRemoteMode = paywalloService.getSessionFlag("use_remote_paywall") === "true";

    if (isRemoteMode) {
      // MODE A: Remote Panel (Configured in Paywallo Dashboard)
      const result = await presentCampaign("main-offer");
      if (result.purchased) handleSuccess();
    } else {
      // MODE B: Local UI (Custom Components)
      setShowLocalPaywall(true);
      
      // Track impression for the local paywall
      paywalloService.track("$paywall_viewed", {
        paywall_variant: "v1_modern",
        placement: "onboarding_end"
      });
    }
  };
};
```

---

## 2. Event Tracking (Conversions & Funnel)

For the Paywallo Dashboard to calculate conversion rates and ROI correctly, these specific events MUST be tracked during the paywall flow.

### A. View Impression
Track this as soon as the paywall becomes visible to the user.
```javascript
paywalloService.track("$paywall_viewed", {
  paywall_variant: "variant_name", // e.g., 'control', 'test_a'
  placement: "quiz_paywall",       // Where the paywall is triggered
  offering_variant: "annual_focus" // Optional: specific price grouping
});
```

### B. Conversion (Purchase)
Track this immediately after a successful transaction.
```javascript
paywalloService.track("$purchase_completed", {
  priceUsd: 19.99,                 // Standardized price in USD for stats
  product_id: "com.app.annual",    // Store product identifier
  paywall_variant: "variant_name"  // Links purchase to the viewed variant
});
```

---

## 3. RevenueCat / Purchases Integration

When using external purchase providers (like RevenueCat), sync the Paywallo variant as a subscriber attribute to enable cross-platform attribution.

```javascript
import Purchases from "react-native-purchases";

const syncVariantToStore = async (variant) => {
  try {
    await Purchases.setAttributes({
      paywall_variant: variant,
      paywallo_distinct_id: paywalloService.getDistinctId()
    });
  } catch (e) {}
};
```

---

## 4. Key Paywall Components

| Component / Method | Purpose | Implementation Detail |
| :--- | :--- | :--- |
| `presentCampaign(id)` | Shows Remote Paywall | Resolves with `{ purchased, cancelled, restored }`. |
| `$paywall_viewed` | tracking event | Standardizes the "Entry" point of the paywall funnel. |
| `getVariant(key)` | Feature Flag | Used to A/B test different paywall designs or pricing. |

---

## 5. Best Practices for Paywalls
1. **Silent Fallback**: If `presentCampaign` fails or flags aren't ready, always have a local "safety" paywall UI ready to render.
2. **Distinct Attribution**: Always include the `paywall_variant` in the `$purchase_completed` event.
3. **Session Consistency**: Declare the `paywall_variant` flag in the initial `PaywalloProvider` config to avoid flickers or delays in fetching the variant.
