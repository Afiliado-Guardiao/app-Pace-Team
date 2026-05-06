import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { ERROR_CODES } from "@/lib/constants/errorCodes";
import {
	InvalidCredentialsError,
	NetworkError,
	ServerError,
	TimeoutError,
	UnauthorizedError,
	ValidationError,
} from "@/lib/errors";
import { useStore } from "@/store";

import { apiClient } from "../client";

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
	const token = useStore.getState().token;

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
	return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
	return response;
};

const onResponseError = (error: AxiosError): Promise<Error> => {
	if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
		return Promise.reject(new TimeoutError());
	}

	if (error.code === "ERR_NETWORK" || !error.response) {
		return Promise.reject(new NetworkError());
	}

	const status = error.response.status;
	const responseData = error.response.data as {
		error?: string;
		message?: string;
		field?: string;
		fieldMessage?: string;
		details?: unknown;
	};

	if (status === 401) {
		useStore.getState().logout();

		if (responseData.error === ERROR_CODES.INVALID_CREDENTIALS) {
			return Promise.reject(
				new InvalidCredentialsError(responseData.message || "Invalid credentials"),
			);
		}

		return Promise.reject(new UnauthorizedError(responseData.message));
	}

	if (status === 400 && responseData.error === ERROR_CODES.VALIDATION_ERROR) {
		return Promise.reject(
			new ValidationError(
				responseData.message || "Validation error",
				responseData.field,
				responseData.fieldMessage,
				responseData.details,
			),
		);
	}

	if (status >= 500) {
		return Promise.reject(new ServerError(responseData.message));
	}

	return Promise.reject(error);
};

export const setupInterceptors = () => {
	apiClient.interceptors.request.use(onRequest, onRequestError);
	apiClient.interceptors.response.use(onResponse, onResponseError);
};
