import { useCallback } from "react";

import { useOnboarding } from "@virex-tech/paywallo-sdk";

export interface IUseOnboardingTrackingReturn {
	trackStepViewed: (stepName: string) => Promise<void>;
	trackStepDropped: (stepName: string) => Promise<void>;
	trackOnboardingCompleted: () => Promise<void>;
}

export const useOnboardingTracking = (): IUseOnboardingTrackingReturn => {
	const { step, complete, drop } = useOnboarding();

	const trackStepViewed = useCallback(
		async (stepName: string): Promise<void> => {
			await step(stepName);
		},
		[step],
	);

	const trackStepDropped = useCallback(
		async (stepName: string): Promise<void> => {
			await drop(stepName);
		},
		[drop],
	);

	const trackOnboardingCompleted = useCallback(async (): Promise<void> => {
		await complete();
	}, [complete]);

	return {
		trackStepViewed,
		trackStepDropped,
		trackOnboardingCompleted,
	};
};
