import { ERROR_CODES } from "@/shared/constants/errorCodes";
import { DomainError } from "@/shared/errors";

export class OnboardingNotFoundError extends DomainError {
	constructor() {
		super("Onboarding not found", {
			code: ERROR_CODES.ONBOARDING_NOT_FOUND,
			statusCode: 404,
		});
		this.name = "OnboardingNotFoundError";
	}
}

export class InvalidOnboardingError extends DomainError {
	constructor(message = "Invalid onboarding data") {
		super(message, {
			code: ERROR_CODES.INVALID_ONBOARDING,
			statusCode: 400,
		});
		this.name = "InvalidOnboardingError";
	}
}

export class OnboardingAlreadyLinkedError extends DomainError {
	constructor() {
		super("Onboarding is already linked to another user", {
			code: ERROR_CODES.ONBOARDING_ALREADY_LINKED,
			statusCode: 409,
		});
		this.name = "OnboardingAlreadyLinkedError";
	}
}
