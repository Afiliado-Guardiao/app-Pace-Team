import { ERROR_CODES } from "@/shared/constants/errorCodes";
import { DomainError } from "@/shared/errors";

export class ReferralAlreadyUsedError extends DomainError {
	constructor() {
		super("Referral code already applied. Cannot change it.", {
			code: ERROR_CODES.REFERRAL_ALREADY_USED,
			statusCode: 409,
		});
		this.name = "ReferralAlreadyUsedError";
	}
}

export class SelfReferralError extends DomainError {
	constructor() {
		super("You cannot refer yourself.", {
			code: ERROR_CODES.SELF_REFERRAL,
			statusCode: 400,
		});
		this.name = "SelfReferralError";
	}
}

export class ReferralCodeNotFoundError extends DomainError {
	constructor(code: string) {
		super(`Referral code not found: ${code}`, {
			code: ERROR_CODES.REFERRAL_CODE_NOT_FOUND,
			statusCode: 404,
		});
		this.name = "ReferralCodeNotFoundError";
	}
}
