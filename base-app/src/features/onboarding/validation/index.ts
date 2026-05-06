import { IOnboardingStep, IValidationResult } from "../types";

import { validateInputStep } from "./schemas";

export const validateStep = (
	step: IOnboardingStep,
	answer: string | string[] | undefined,
): IValidationResult => {
	if (step.type === "transition") {
		return { isValid: true };
	}

	if (step.type === "wheel-picker") {
		if (step.validation?.required && !answer) {
			return { isValid: false, errorKey: "validation.required" };
		}
		return { isValid: true };
	}

	const validation = step.validation;

	if (!validation) {
		return { isValid: true };
	}

	if (validation.required && !answer) {
		return {
			isValid: false,
			errorKey: "validation.required",
		};
	}

	if (!answer) {
		return { isValid: true };
	}

	return validateInputStep(step, String(answer), validation);
};
