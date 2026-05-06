import { IInputStep, IStepValidation, IValidationResult } from "../types";

export const validateInputStep = (
	step: IInputStep,
	answer: string,
	validation: IStepValidation,
): IValidationResult => {
	const value = answer;

	if (validation.minLength && value.length < validation.minLength) {
		return {
			isValid: false,
			errorKey: validation.errorMessageKey || "validation.required",
		};
	}

	if (validation.maxLength && value.length > validation.maxLength) {
		return {
			isValid: false,
			errorKey: validation.errorMessageKey || "validation.required",
		};
	}

	if (validation.pattern && !validation.pattern.test(value)) {
		return {
			isValid: false,
			errorKey: validation.errorMessageKey || "validation.required",
		};
	}

	if (step.keyboardType === "number-pad" || step.keyboardType === "numeric") {
		const numValue = Number(value);

		if (isNaN(numValue)) {
			return {
				isValid: false,
				errorKey: validation.errorMessageKey || "validation.required",
			};
		}
	}

	return { isValid: true };
};
