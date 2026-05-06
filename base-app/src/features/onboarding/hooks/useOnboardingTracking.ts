import { useCallback, useRef } from "react";

import type { IOnboardingStep } from "../types";

interface IUseOnboardingTrackingParams {
	currentStepIndex: number;
	currentStep: IOnboardingStep;
	totalSteps: number;
}

// TODO(fase-2): integrar serviço de analytics quando disponível
export const useOnboardingTracking = ({
	currentStepIndex: _currentStepIndex,
	currentStep: _currentStep,
	totalSteps: _totalSteps,
}: IUseOnboardingTrackingParams) => {
	const sessionStartTimeRef = useRef<number>(Date.now());

	const trackOnboardingStarted = useCallback(() => {
		void sessionStartTimeRef.current;
	}, []);

	const trackStepCompleted = useCallback(() => {}, []);

	const trackOnboardingCompleted = useCallback(() => {}, []);

	return {
		trackOnboardingStarted,
		trackStepCompleted,
		trackOnboardingCompleted,
	};
};
