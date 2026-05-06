import axios from "axios";
import i18next from "i18next";
import { ZodError } from "zod";

import { zodErrorToI18nKey } from "@/lib/validation";

import { IEmailAuthErrors } from "../types";

import { emailLoginSchema, emailRegisterSchema } from "./schemas";

export const validateEmailLoginForm = (email: string, password: string): IEmailAuthErrors => {
	try {
		emailLoginSchema.parse({ email, password });
		return {};
	} catch (error) {
		if (error instanceof ZodError) {
			const errors: IEmailAuthErrors = {};
			error.errors.forEach((err) => {
				const field = err.path[0] as keyof IEmailAuthErrors;
				const fieldName = err.path[0] as string;
				const i18nKey = zodErrorToI18nKey(err.message, fieldName);
				errors[field] = i18next.t(i18nKey);
			});
			return errors;
		}
		return {};
	}
};

export const validateEmailRegisterForm = (
	name: string,
	email: string,
	password: string,
	confirmPassword: string,
): IEmailAuthErrors => {
	try {
		emailRegisterSchema.parse({ name, email, password, confirmPassword });
		return {};
	} catch (error) {
		if (error instanceof ZodError) {
			const errors: IEmailAuthErrors = {};
			error.errors.forEach((err) => {
				const field = err.path[0] as keyof IEmailAuthErrors;
				const fieldName = err.path[0] as string;
				const i18nKey = zodErrorToI18nKey(err.message, fieldName);
				errors[field] = i18next.t(i18nKey);
			});
			return errors;
		}
		return {};
	}
};

export interface IEnhancedErrorResponse {
	error: string;
	message: string;
	field?: string;
	fieldMessage?: string;
	details?: Array<{
		path: (string | number)[];
		message: string;
		code: string;
	}>;
}

export const getErrorMessage = (error: unknown, defaultKey: string): string => {
	if (error instanceof Error) {
		return error.message;
	}

	if (axios.isAxiosError<IEnhancedErrorResponse>(error)) {
		const errorData = error.response?.data;

		if (errorData?.message) {
			return errorData.message;
		}
	}

	return defaultKey;
};
