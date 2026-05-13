import { describe, expect, it } from "@jest/globals";
import { createHmac } from "crypto";

import { createUser } from "../../../../tests/fixtures";
import { getDatabase } from "../../../../tests/helpers/database";
import { getTestServer } from "../../../../tests/helpers/testServer";

const PATH_SECRET = process.env.PAYWALLO_WEBHOOK_PATH_SECRET ?? "";
const HMAC_SECRET = process.env.PAYWALLO_WEBHOOK_HMAC_SECRET ?? "";

interface IWebhookSuccessResponse {
	received: boolean;
	eventId: string;
	deduplicated: boolean;
}

function buildPayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
	const now = Date.now();
	return {
		api_version: "1.0",
		event: {
			id: `pw_test-${String(now)}-${Math.random().toString(36).slice(2)}`,
			type: "INITIAL_PURCHASE",
			event_timestamp_ms: now,
			app_user_id: "anon-default",
			original_app_user_id: "anon-default",
			product_id: "premium_monthly",
			price: 9.99,
			currency: "USD",
			store: "APP_STORE",
			environment: "SANDBOX",
			period_type: "NORMAL",
			transaction_id: `txn-${String(now)}`,
			original_transaction_id: `txn-original-${String(now)}-${Math.random().toString(36).slice(2)}`,
			expiration_at_ms: now + 30 * 24 * 60 * 60 * 1000,
			country_code: "BR",
			entitlement_ids: ["premium"],
			...overrides,
		},
	};
}

function signBody(body: string): string {
	return `sha256=${createHmac("sha256", HMAC_SECRET).update(body).digest("hex")}`;
}

describe("Subscription Webhook Integration Tests", () => {
	describe("POST /webhooks/paywallo/:pathSecret", () => {
		it("should reject invalid path secret with 401", async () => {
			const app = getTestServer();
			const payload = buildPayload();
			const body = JSON.stringify(payload);

			const response = await app.inject({
				method: "POST",
				url: "/webhooks/paywallo/wrong-secret",
				headers: {
					"content-type": "application/json",
					"x-paywallo-signature": signBody(body),
				},
				payload: body,
			});

			expect(response.statusCode).toBe(401);
		});

		it("should reject invalid HMAC signature with 401", async () => {
			const app = getTestServer();
			const payload = buildPayload();
			const body = JSON.stringify(payload);

			const response = await app.inject({
				method: "POST",
				url: `/webhooks/paywallo/${PATH_SECRET}`,
				headers: {
					"content-type": "application/json",
					"x-paywallo-signature": "sha256=invalid",
				},
				payload: body,
			});

			expect(response.statusCode).toBe(401);
		});

		it("should accept INITIAL_PURCHASE for anonymous user (no userId)", async () => {
			const app = getTestServer();
			const payload = buildPayload();
			const body = JSON.stringify(payload);

			const response = await app.inject({
				method: "POST",
				url: `/webhooks/paywallo/${PATH_SECRET}`,
				headers: {
					"content-type": "application/json",
					"x-paywallo-signature": signBody(body),
				},
				payload: body,
			});

			expect(response.statusCode).toBe(200);
			const json = JSON.parse(response.body) as IWebhookSuccessResponse;
			expect(json.received).toBe(true);
			expect(json.deduplicated).toBe(false);

			const event = payload.event as { original_transaction_id: string };
			const db = getDatabase();
			const subscription = await db.subscription.findUnique({
				where: { originalTransactionId: event.original_transaction_id },
			});
			expect(subscription).not.toBeNull();
			expect(subscription?.status).toBe("active");
			expect(subscription?.userId).toBeNull();
		});

		it("should link to user via Onboarding.anonymousUserId and flip isPremium", async () => {
			const app = getTestServer();
			const db = getDatabase();

			const user = await createUser();
			await db.onboarding.create({
				data: {
					anonymousUserId: "anon-with-onb",
					userId: user.id,
				},
			});

			const payload = buildPayload({ app_user_id: "anon-with-onb" });
			const body = JSON.stringify(payload);

			const response = await app.inject({
				method: "POST",
				url: `/webhooks/paywallo/${PATH_SECRET}`,
				headers: {
					"content-type": "application/json",
					"x-paywallo-signature": signBody(body),
				},
				payload: body,
			});

			expect(response.statusCode).toBe(200);

			const updatedUser = await db.user.findUnique({ where: { id: user.id } });
			expect(updatedUser?.isPremium).toBe(true);

			const event = payload.event as { original_transaction_id: string };
			const sub = await db.subscription.findUnique({
				where: { originalTransactionId: event.original_transaction_id },
			});
			expect(sub?.userId).toBe(user.id);
		});

		it("should deduplicate replayed events by eventId", async () => {
			const app = getTestServer();
			const payload = buildPayload();
			const body = JSON.stringify(payload);

			const first = await app.inject({
				method: "POST",
				url: `/webhooks/paywallo/${PATH_SECRET}`,
				headers: {
					"content-type": "application/json",
					"x-paywallo-signature": signBody(body),
				},
				payload: body,
			});
			expect(first.statusCode).toBe(200);
			expect((JSON.parse(first.body) as IWebhookSuccessResponse).deduplicated).toBe(false);

			const second = await app.inject({
				method: "POST",
				url: `/webhooks/paywallo/${PATH_SECRET}`,
				headers: {
					"content-type": "application/json",
					"x-paywallo-signature": signBody(body),
				},
				payload: body,
			});
			expect(second.statusCode).toBe(200);
			expect((JSON.parse(second.body) as IWebhookSuccessResponse).deduplicated).toBe(true);
		});

		it("should mark user as not premium on CANCELLATION", async () => {
			const app = getTestServer();
			const db = getDatabase();

			const user = await createUser();
			await db.onboarding.create({
				data: { anonymousUserId: "anon-cancel", userId: user.id },
			});

			const purchasePayload = buildPayload({ app_user_id: "anon-cancel" });
			const purchaseBody = JSON.stringify(purchasePayload);
			await app.inject({
				method: "POST",
				url: `/webhooks/paywallo/${PATH_SECRET}`,
				headers: {
					"content-type": "application/json",
					"x-paywallo-signature": signBody(purchaseBody),
				},
				payload: purchaseBody,
			});

			const purchaseEvent = purchasePayload.event as { original_transaction_id: string };
			const cancelPayload = buildPayload({
				app_user_id: "anon-cancel",
				type: "CANCELLATION",
				original_transaction_id: purchaseEvent.original_transaction_id,
			});
			const cancelBody = JSON.stringify(cancelPayload);

			const response = await app.inject({
				method: "POST",
				url: `/webhooks/paywallo/${PATH_SECRET}`,
				headers: {
					"content-type": "application/json",
					"x-paywallo-signature": signBody(cancelBody),
				},
				payload: cancelBody,
			});

			expect(response.statusCode).toBe(200);

			const updatedUser = await db.user.findUnique({ where: { id: user.id } });
			expect(updatedUser?.isPremium).toBe(false);

			const sub = await db.subscription.findUnique({
				where: { originalTransactionId: purchaseEvent.original_transaction_id },
			});
			expect(sub?.status).toBe("cancelled");
			expect(sub?.cancelledAt).not.toBeNull();
		});

		it("should reject unsupported event type with 400", async () => {
			const app = getTestServer();
			const payload = buildPayload({ type: "GARBAGE_EVENT" });
			const body = JSON.stringify(payload);

			const response = await app.inject({
				method: "POST",
				url: `/webhooks/paywallo/${PATH_SECRET}`,
				headers: {
					"content-type": "application/json",
					"x-paywallo-signature": signBody(body),
				},
				payload: body,
			});

			expect(response.statusCode).toBe(400);
		});
	});
});
