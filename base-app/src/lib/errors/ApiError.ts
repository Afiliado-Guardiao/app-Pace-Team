import { ERROR_CODES } from "@/lib/constants/errorCodes";

export class ApiError extends Error {
	constructor(
		message: string,
		public readonly code: string,
		public readonly statusCode: number = 500,
		public readonly details?: unknown,
	) {
		super(message);
		this.name = "ApiError";
		Error.captureStackTrace(this, this.constructor);
	}
}

export class NetworkError extends ApiError {
	constructor(message = "Network error. Please check your connection.") {
		super(message, ERROR_CODES.NETWORK_ERROR, 0);
		this.name = "NetworkError";
	}
}

export class ValidationError extends ApiError {
	constructor(
		message = "Validation error",
		public readonly field?: string,
		public readonly fieldMessage?: string,
		details?: unknown,
	) {
		super(message, ERROR_CODES.VALIDATION_ERROR, 400, details);
		this.name = "ValidationError";
	}
}

export class AuthError extends ApiError {
	constructor(message: string, code: string, statusCode: number = 401) {
		super(message, code, statusCode);
		this.name = "AuthError";
	}
}

export class InvalidCredentialsError extends AuthError {
	constructor(message = "Invalid credentials") {
		super(message, ERROR_CODES.INVALID_CREDENTIALS, 401);
		this.name = "InvalidCredentialsError";
	}
}

export class UnauthorizedError extends AuthError {
	constructor(message = "Unauthorized access") {
		super(message, ERROR_CODES.UNAUTHORIZED, 401);
		this.name = "UnauthorizedError";
	}
}

export class ServerError extends ApiError {
	constructor(message = "Server error. Please try again later.") {
		super(message, ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
		this.name = "ServerError";
	}
}

export class TimeoutError extends ApiError {
	constructor(message = "Request timeout. Please try again.") {
		super(message, ERROR_CODES.TIMEOUT_ERROR, 408);
		this.name = "TimeoutError";
	}
}
