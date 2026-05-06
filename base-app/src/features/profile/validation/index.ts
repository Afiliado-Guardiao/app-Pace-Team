import i18next from "i18next";
import { ZodError } from "zod";

import { zodErrorToI18nKey } from "@/lib/validation";

import { passwordChangeSchema, profileUpdateSchema } from "./schemas";

interface IValidationErrors {
	[key: string]: string;
}

export const validateProfileUpdate = (name: string, email?: string): IValidationErrors => {
	try {
		profileUpdateSchema.parse({ name, email });
		return {};
	} catch (error) {
		if (error instanceof ZodError) {
			const errors: IValidationErrors = {};
			error.errors.forEach((err) => {
				const field = err.path[0] as string;
				const i18nKey = zodErrorToI18nKey(err.message, field);
				errors[field] = i18next.t(i18nKey);
			});
			return errors;
		}
		return {};
	}
};

export const validatePasswordChange = (
	currentPassword: string,
	newPassword: string,
	confirmPassword: string,
): IValidationErrors => {
	try {
		passwordChangeSchema.parse({ currentPassword, newPassword, confirmPassword });
		return {};
	} catch (error) {
		if (error instanceof ZodError) {
			const errors: IValidationErrors = {};
			error.errors.forEach((err) => {
				const field = err.path[0] as string;
				const i18nKey = zodErrorToI18nKey(err.message, field);
				errors[field] = i18next.t(i18nKey);
			});
			return errors;
		}
		return {};
	}
};

export type { IPasswordChangeSchema, IProfileUpdateSchema } from "./schemas";
export { passwordChangeSchema, profileUpdateSchema } from "./schemas";
