import { useCallback } from "react";

import { useOnboarding } from "@virex-tech/paywallo-sdk";

export interface IUseOnboardingTrackingReturn {
	trackStepViewed: (stepName: string, order: number) => Promise<void>;
	trackOnboardingCompleted: () => Promise<void>;
}

/**
 * Funil de onboarding no Paywallo.
 *
 * `order` é obrigatório desde a 2.6.0 (1-based; use decimais como `2.1` para
 * variantes A/B do mesmo passo). Não existe mais `drop()`: o abandono é
 * inferido no backend a partir do último `step` sem `complete`.
 */
export const useOnboardingTracking = (): IUseOnboardingTrackingReturn => {
	const { step, complete } = useOnboarding();

	const trackStepViewed = useCallback(
		async (stepName: string, order: number): Promise<void> => {
			await step(stepName, order);
		},
		[step],
	);

	const trackOnboardingCompleted = useCallback(async (): Promise<void> => {
		await complete();
	}, [complete]);

	return {
		trackStepViewed,
		trackOnboardingCompleted,
	};
};
