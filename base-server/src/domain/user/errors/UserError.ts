import { ERROR_CODES } from "@/shared/constants/errorCodes";
import { DomainError } from "@/shared/errors";

export class UserNotFoundError extends DomainError {
	constructor() {
		super("User not found", { code: ERROR_CODES.USER_NOT_FOUND, statusCode: 404 });
		this.name = "UserNotFoundError";
	}
}

export class EmailAlreadyExistsError extends DomainError {
	constructor() {
		super("Email already exists", { code: ERROR_CODES.EMAIL_ALREADY_EXISTS, statusCode: 409 });
		this.name = "EmailAlreadyExistsError";
	}
}

export class InvalidPasswordError extends DomainError {
	constructor() {
		super("Current password is incorrect", {
			code: ERROR_CODES.INVALID_PASSWORD,
			statusCode: 401,
		});
		this.name = "InvalidPasswordError";
	}
}
