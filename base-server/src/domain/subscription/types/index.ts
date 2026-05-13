import { z } from "zod";

/**
 * Eventos disparados pelo servidor Paywallo no formato RevenueCat-compatible.
 * Mapeamento Paywallo (`$subscription_*`) → tipo público abaixo é feito server-side.
 */
export const WEBHOOK_EVENT_TYPES = [
	"INITIAL_PURCHASE",
	"RENEWAL",
	"CANCELLATION",
	"EXPIRATION",
	"UNCANCELLATION",
] as const;

export type WebhookEventType = (typeof WEBHOOK_EVENT_TYPES)[number];

export const webhookEventTypeSchema = z.enum(WEBHOOK_EVENT_TYPES);

export const paywalloWebhookEventSchema = z.object({
	id: z.string().min(1),
	type: webhookEventTypeSchema,
	event_timestamp_ms: z.number().int().nonnegative(),
	app_user_id: z.string().min(1),
	original_app_user_id: z.string().min(1).optional(),
	product_id: z.string().min(1),
	price: z.number().optional(),
	currency: z.string().optional(),
	store: z.string().min(1),
	environment: z.string().min(1),
	period_type: z.string().optional(),
	transaction_id: z.string().min(1),
	original_transaction_id: z.string().min(1),
	expiration_at_ms: z.number().int().nonnegative().optional(),
	country_code: z.string().optional(),
	entitlement_ids: z.array(z.string()).optional(),
});

export const paywalloWebhookPayloadSchema = z.object({
	api_version: z.string().min(1),
	event: paywalloWebhookEventSchema,
});

export type PaywalloWebhookPayload = z.infer<typeof paywalloWebhookPayloadSchema>;
export type PaywalloWebhookEvent = z.infer<typeof paywalloWebhookEventSchema>;

export const webhookPathParamSchema = z.object({
	pathSecret: z.string().min(1),
});

export type WebhookPathParam = z.infer<typeof webhookPathParamSchema>;

export type SubscriptionStatus =
	| "active"
	| "expired"
	| "cancelled"
	| "in_grace_period"
	| "in_billing_retry"
	| "revoked"
	| "paused";

export interface SubscriptionData {
	id: string;
	userId: string | null;
	anonymousUserId: string | null;
	productId: string;
	status: SubscriptionStatus;
	store: string;
	environment: string;
	isTrial: boolean;
	startedAt: Date;
	expiresAt: Date | null;
	cancelledAt: Date | null;
	originalTransactionId: string;
	lastEventId: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface UpsertSubscriptionInput {
	userId: string | null;
	anonymousUserId: string | null;
	productId: string;
	status: SubscriptionStatus;
	store: string;
	environment: string;
	isTrial: boolean;
	startedAt: Date;
	expiresAt: Date | null;
	cancelledAt: Date | null;
	originalTransactionId: string;
	lastEventId: string;
}

export interface ProcessWebhookResult {
	eventId: string;
	eventType: WebhookEventType;
	deduplicated: boolean;
	subscriptionId: string | null;
}

export interface ISubscriptionRepository {
	upsertByOriginalTransactionId(input: UpsertSubscriptionInput): Promise<SubscriptionData>;
	findActiveByUserId(userId: string): Promise<SubscriptionData | null>;
	findByOriginalTransactionId(originalTransactionId: string): Promise<SubscriptionData | null>;
	setUserPremium(userId: string, isPremium: boolean): Promise<void>;
	wasEventProcessed(eventId: string): Promise<boolean>;
	markEventProcessed(eventId: string, eventType: string, payload: unknown): Promise<void>;
	findUserByAnonymousId(anonymousUserId: string): Promise<{ id: string } | null>;
}

export interface ISubscriptionService {
	hasActiveSubscription(userId: string): Promise<boolean>;
	getActiveSubscription(userId: string): Promise<SubscriptionData | null>;
}

export interface IWebhookProcessor {
	process(payload: PaywalloWebhookPayload): Promise<ProcessWebhookResult>;
}

export interface IWebhookVerifier {
	verifyPathSecret(pathSecret: string): boolean;
	verifySignature(rawBody: string, signature: string | undefined): boolean;
}
