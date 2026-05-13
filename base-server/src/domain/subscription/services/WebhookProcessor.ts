import { Logger } from "@/core/config/logger";

import {
	ISubscriptionRepository,
	IWebhookProcessor,
	PaywalloWebhookEvent,
	PaywalloWebhookPayload,
	ProcessWebhookResult,
	SubscriptionStatus,
	UpsertSubscriptionInput,
	WebhookEventType,
} from "../types";

const STATUS_BY_EVENT_TYPE: Record<WebhookEventType, SubscriptionStatus> = {
	INITIAL_PURCHASE: "active",
	RENEWAL: "active",
	UNCANCELLATION: "active",
	CANCELLATION: "cancelled",
	EXPIRATION: "expired",
};

const ACTIVE_STATUSES: SubscriptionStatus[] = ["active", "in_grace_period", "in_billing_retry"];

export class WebhookProcessor implements IWebhookProcessor {
	constructor(
		private logger: Logger,
		private subscriptionRepository: ISubscriptionRepository,
	) {}

	async process(payload: PaywalloWebhookPayload): Promise<ProcessWebhookResult> {
		const { event } = payload;
		this.logger.info("Processing webhook event", { eventId: event.id, type: event.type });

		const wasProcessed = await this.subscriptionRepository.wasEventProcessed(event.id);
		if (wasProcessed) {
			this.logger.info("Webhook event already processed — skipping", { eventId: event.id });
			return {
				eventId: event.id,
				eventType: event.type,
				deduplicated: true,
				subscriptionId: null,
			};
		}

		const userId = await this.resolveUserId(event.app_user_id);
		const input = this.buildUpsertInput(event, userId);

		const subscription = await this.subscriptionRepository.upsertByOriginalTransactionId(input);

		if (userId) {
			const isPremium = ACTIVE_STATUSES.includes(input.status);
			await this.subscriptionRepository.setUserPremium(userId, isPremium);
		}

		await this.subscriptionRepository.markEventProcessed(event.id, event.type, payload);

		return {
			eventId: event.id,
			eventType: event.type,
			deduplicated: false,
			subscriptionId: subscription.id,
		};
	}

	private async resolveUserId(appUserId: string): Promise<string | null> {
		const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
			appUserId,
		);
		if (isUuid) return appUserId;

		const user = await this.subscriptionRepository.findUserByAnonymousId(appUserId);
		return user?.id ?? null;
	}

	private buildUpsertInput(
		event: PaywalloWebhookEvent,
		userId: string | null,
	): UpsertSubscriptionInput {
		const status = STATUS_BY_EVENT_TYPE[event.type];
		const startedAt = new Date(event.event_timestamp_ms);
		const expiresAt = event.expiration_at_ms ? new Date(event.expiration_at_ms) : null;
		const cancelledAt = event.type === "CANCELLATION" ? new Date(event.event_timestamp_ms) : null;
		const anonymousUserId = userId === null ? event.app_user_id : null;

		return {
			userId,
			anonymousUserId,
			productId: event.product_id,
			status,
			store: event.store,
			environment: event.environment,
			isTrial: event.period_type === "TRIAL",
			startedAt,
			expiresAt,
			cancelledAt,
			originalTransactionId: event.original_transaction_id,
			lastEventId: event.id,
		};
	}
}
