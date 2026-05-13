import { ERROR_CODES } from "@/shared/constants/errorCodes";
import { DomainError } from "@/shared/errors";

export class SubscriptionNotFoundError extends DomainError {
	constructor() {
		super("Subscription not found", {
			code: ERROR_CODES.SUBSCRIPTION_NOT_FOUND,
			statusCode: 404,
		});
		this.name = "SubscriptionNotFoundError";
	}
}

export class WebhookPathSecretInvalidError extends DomainError {
	constructor() {
		super("Webhook path secret is invalid", {
			code: ERROR_CODES.WEBHOOK_PATH_SECRET_INVALID,
			statusCode: 401,
		});
		this.name = "WebhookPathSecretInvalidError";
	}
}

export class WebhookSignatureInvalidError extends DomainError {
	constructor() {
		super("Webhook signature is invalid", {
			code: ERROR_CODES.WEBHOOK_SIGNATURE_INVALID,
			statusCode: 401,
		});
		this.name = "WebhookSignatureInvalidError";
	}
}

export class WebhookEventTypeUnsupportedError extends DomainError {
	constructor(eventType: string) {
		super(`Webhook event type "${eventType}" is not supported`, {
			code: ERROR_CODES.WEBHOOK_EVENT_TYPE_UNSUPPORTED,
			statusCode: 400,
		});
		this.name = "WebhookEventTypeUnsupportedError";
	}
}
