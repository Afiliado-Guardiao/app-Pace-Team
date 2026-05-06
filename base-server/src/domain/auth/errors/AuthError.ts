import { ERROR_CODES } from "@/shared/constants/errorCodes";
import { DomainError } from "@/shared/errors";

export class EmailAlreadyExistsError extends DomainError {
	constructor() {
		super("Email already exists", { code: ERROR_CODES.EMAIL_ALREADY_EXISTS, statusCode: 409 });
		this.name = "EmailAlreadyExistsError";
	}
}

export class InvalidCredentialsError extends DomainError {
	constructor() {
		super("Invalid email or password", {
			code: ERROR_CODES.INVALID_CREDENTIALS,
			statusCode: 401,
		});
		this.name = "InvalidCredentialsError";
	}
}

export class UserNotFoundError extends DomainError {
	constructor() {
		super("User not found", { code: ERROR_CODES.USER_NOT_FOUND, statusCode: 404 });
		this.name = "UserNotFoundError";
	}
}

export class InvalidTokenError extends DomainError {
	constructor() {
		super("Invalid or expired token", { code: ERROR_CODES.INVALID_TOKEN, statusCode: 401 });
		this.name = "InvalidTokenError";
	}
}

export class ReferralCodeGenerationError extends DomainError {
	constructor() {
		super("Failed to generate unique referral code", {
			code: ERROR_CODES.INTERNAL_SERVER_ERROR,
			statusCode: 500,
		});
		this.name = "ReferralCodeGenerationError";
	}
}
