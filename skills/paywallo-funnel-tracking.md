# Paywallo: Funnel Tracking & Dropout Analysis

This guide describes the standard pattern for tracking user flows (Onboarding, Signup, Checkout) to identify where users drop out.

## 1. Funnel Strategy
To analyze dropouts, we track a series of events using the same root name across steps. The Paywallo dashboard then calculates the conversion rate between these steps.

### Event Naming Standard
- `$onboarding_started`: Sent at the very first interaction.
- `$onboarding_step`: Sent at every significant progress point.
- `$onboarding_completed`: Sent when the goal is reached.

## 2. Tracking `Onboarding Steps`

The core event is `$onboarding_step`. It must include `stepIndex` to allow the dashboard to order the funnel correctly.

### Schema
```typescript
interface IOnboardingStepProperties {
  stepName: string;      // Human-readable name (e.g., "Medication Selection")
  stepIndex: number;     // 0-indexed or 1-indexed (be consistent)
  totalSteps: number;    // Total steps to show progress percentage
  variant?: string;      // A/B test variant name
  timeSinceStart?: number; // Milliseconds since $onboarding_started
}
```

### Implementation Pattern
```typescript
import { paywalloService } from "@/app/services/paywallo";

const trackStep = async (stepInfo: IOnboardingStepProperties) => {
  await paywalloService.trackOnboardingStep({
    ...stepInfo,
  });
};
```

## 3. Dropout Analysis
Dropout occurs when a user triggers Step `N` but never triggers Step `N+1`.

### Best Practices for Analysis:
- **Include Variant**: Always include the A/B test `variant` in every step track. This allows you to see if one variant has a higher dropout rate at a specific step.
- **Timing**: Track `timeSinceStart`. If dropouts increase at steps that take too long (e.g., loading screens), it indicates a technical or friction issue.
- **Failures**: If a step fails (e.g., server error in step 5), track a `step_error` event with the step index.

## 4. Completion
Always trigger `$onboarding_completed` at the very end. This is the ultimate "Success" metric for the funnel.

```typescript
await paywalloService.trackOnboardingCompleted({
  totalSteps: totalStepsCount,
  totalTime: Date.now() - startTime,
  variant: currentVariant
});
```
