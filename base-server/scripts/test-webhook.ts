#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

const WEBHOOK_UUID = "a3f4b8c2-9d1e-4f5a-b3c7-8e9f0a1b2c3d";
const BASE_URL = process.env.TEST_URL ?? "http://localhost:11000";

const now = Date.now();
const testPayload = {
	api_version: "1.0",
	event: {
		type: "INITIAL_PURCHASE",
		id: `test-event-${String(now)}`,
		app_user_id: "test-anonymous-user-123",
		event_timestamp_ms: now,
		product_id: "premium_monthly",
		price: 9.99,
		currency: "USD",
		expiration_at_ms: now + 30 * 24 * 60 * 60 * 1000, // 30 dias
		purchased_at_ms: now,
		store: "app_store",
		environment: "SANDBOX",
		period_type: "NORMAL",
		transaction_id: `test-transaction-${String(now)}`,
		original_transaction_id: `test-original-${String(now)}`,
		price_in_purchased_currency: 9.99,
		is_trial_conversion: false,
	},
};

async function testWebhook(): Promise<void> {
	const url = `${BASE_URL}/webhooks/rc-${WEBHOOK_UUID}`;

	// eslint-disable-next-line no-console
	console.log("🚀 Testing webhook...");
	// eslint-disable-next-line no-console
	console.log(`📍 URL: ${url}`);
	// eslint-disable-next-line no-console
	console.log("📦 Payload:");
	// eslint-disable-next-line no-console
	console.log(JSON.stringify(testPayload, null, 2));
	// eslint-disable-next-line no-console
	console.log("\n⏳ Sending request...\n");

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "RevenueCat-Webhook-Test",
			},
			body: JSON.stringify(testPayload),
		});

		const data = (await response.json()) as Record<string, unknown>;

		// eslint-disable-next-line no-console
		console.log("✅ Response received:");
		// eslint-disable-next-line no-console
		console.log(`Status: ${response.status.toString()} ${response.statusText}`);
		// eslint-disable-next-line no-console
		console.log("Body:", data);

		if (response.ok) {
			// eslint-disable-next-line no-console
			console.log("\n✅ Webhook test successful!");
		} else {
			// eslint-disable-next-line no-console
			console.log("\n❌ Webhook test failed!");
		}
	} catch (error) {
		console.error("\n❌ Request failed:", error);
		process.exit(1);
	}
}

void testWebhook();
