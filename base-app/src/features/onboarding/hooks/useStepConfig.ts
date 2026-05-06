import { useMemo } from "react";

import {
	IInputStep,
	IOnboardingStep,
	ITransitionStep,
	IWheelPickerStep,
} from "../types";

export type IStepConfig =
	| { type: "transition"; props: { step: ITransitionStep } }
	| { type: "input"; props: { step: IInputStep; value: string; onChange: (value: string | string[]) => void; error: string | undefined } }
	| { type: "wheel-picker"; props: { step: IWheelPickerStep; value: string; onChange: (value: string | string[]) => void; error: string | undefined } }
	| { type: "unknown"; props: Record<string, never> };

interface IUseStepConfigParams {
	currentStep: IOnboardingStep;
	currentAnswer: string | string[] | undefined;
	validationError: string | undefined;
	handleAnswerChange: (value: string | string[]) => void;
}

interface IUseStepConfigReturn {
	stepConfig: IStepConfig;
}

export const useStepConfig = ({
	currentStep,
	currentAnswer,
	validationError,
	handleAnswerChange,
}: IUseStepConfigParams): IUseStepConfigReturn => {
	const stepConfig = useMemo((): IStepConfig => {
		switch (currentStep.type) {
			case "transition":
				return { type: "transition" as const, props: { step: currentStep } };

			case "input":
				return {
					type: "input" as const,
					props: { step: currentStep, value: (currentAnswer as string) || "", onChange: handleAnswerChange, error: validationError },
				};

			case "wheel-picker":
				return {
					type: "wheel-picker" as const,
					props: { step: currentStep, value: (currentAnswer as string) || "", onChange: handleAnswerChange, error: validationError },
				};

			default:
				return { type: "unknown" as const, props: {} as Record<string, never> };
		}
	}, [currentStep, currentAnswer, validationError, handleAnswerChange]);

	return { stepConfig };
};
