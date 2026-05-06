import { i18next } from "@/core/i18n";
import { ERROR_CODES, ErrorCode } from "@/shared/constants/errorCodes";

export interface IDomainErrorOptions {
	code: ErrorCode;
	statusCode?: number;
	useI18n?: boolean;
}

export class DomainError extends Error {
	public readonly code: ErrorCode;
	public readonly statusCode: number;
	public readonly useI18n: boolean;

	constructor(message: string, options: IDomainErrorOptions) {
		super(message);
		this.name = "DomainError";
		this.code = options.code;
		this.statusCode = options.statusCode ?? 400;
		this.useI18n = options.useI18n ?? true;
		Error.captureStackTrace(this, this.constructor);
	}

	getLocalizedMessage(language: string): string {
		if (!this.useI18n) return this.message;

		try {
			const i18n = i18next.cloneInstance({ lng: language });
			if (typeof i18n.t !== "function") {
				return this.message;
			}
			return i18n.t(`errors:${this.code}`, { defaultValue: this.message });
		} catch {
			return this.message;
		}
	}
}

export class UnauthorizedError extends DomainError {
	constructor(message = "Unauthorized access") {
		super(message, {
			code: ERROR_CODES.UNAUTHORIZED,
			statusCode: 401,
		});
		this.name = "UnauthorizedError";
	}
}

export class ValidationError extends DomainError {
	constructor(message = "Validation error") {
		super(message, {
			code: ERROR_CODES.VALIDATION_ERROR,
			statusCode: 400,
		});
		this.name = "ValidationError";
	}
}

export class UnauthorizedAccessError extends DomainError {
	constructor() {
		super("You are not authorized to access this resource", {
			code: ERROR_CODES.UNAUTHORIZED_ACCESS,
			statusCode: 403,
		});
		this.name = "UnauthorizedAccessError";
	}
}

export class InternalServerError extends DomainError {
	constructor(message = "An unexpected error occurred") {
		super(message, {
			code: ERROR_CODES.INTERNAL_SERVER_ERROR,
			statusCode: 500,
		});
		this.name = "InternalServerError";
	}
}
