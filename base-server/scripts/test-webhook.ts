#!/usr/bin/env tsx
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { createHmac } from "crypto";

const PATH_SECRET = process.env.PAYWALLO_WEBHOOK_PATH_SECRET ?? "";
const HMAC_SECRET = process.env.PAYWALLO_WEBHOOK_HMAC_SECRET ?? "";
const BASE_URL = process.env.TEST_URL ?? "http://localhost:11000";

if (!PATH_SECRET) {
	console.error("❌ Set PAYWALLO_WEBHOOK_PATH_SECRET env var before running this script.");
	process.exit(1);
}

const now = Date.now();
const testPayload = {
	api_version: "1.0",
	event: {
		id: `pw_test-${String(now)}`,
		type: "INITIAL_PURCHASE" as const,
		event_timestamp_ms: now,
		app_user_id: "test-anonymous-user-123",
		original_app_user_id: "test-anonymous-user-123",
		product_id: "premium_monthly",
		price: 9.99,
		currency: "USD",
		store: "APP_STORE",
		environment: "SANDBOX",
		period_type: "NORMAL",
		transaction_id: `txn-${String(now)}`,
		original_transaction_id: `txn-original-${String(now)}`,
		expiration_at_ms: now + 30 * 24 * 60 * 60 * 1000,
		country_code: "BR",
		entitlement_ids: ["premium"],
	},
};

async function testWebhook(): Promise<void> {
	const url = `${BASE_URL}/webhooks/paywallo/${PATH_SECRET}`;
	const body = JSON.stringify(testPayload);

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		"User-Agent": "Paywallo-Webhook-Test",
	};

	if (HMAC_SECRET) {
		const signature = `sha256=${createHmac("sha256", HMAC_SECRET).update(body).digest("hex")}`;
		headers["X-Paywallo-Signature"] = signature;
	}

	console.log("🚀 Testing Paywallo webhook...");
	console.log(`📍 URL: ${url}`);
	console.log(
		`🔐 HMAC: ${HMAC_SECRET ? "enabled" : "disabled (set PAYWALLO_WEBHOOK_HMAC_SECRET to enable)"}`,
	);
	console.log("📦 Payload:");
	console.log(body);
	console.log("\n⏳ Sending request...\n");

	try {
		const response = await fetch(url, { method: "POST", headers, body });
		const text = await response.text();
		const parsed: unknown = text ? (JSON.parse(text) as unknown) : {};

		console.log("✅ Response received:");
		console.log(`Status: ${String(response.status)} ${response.statusText}`);
		console.log("Body:", parsed);

		if (response.ok) {
			console.log("\n✅ Webhook test successful!");
			process.exit(0);
		} else {
			console.log("\n❌ Webhook test failed!");
			process.exit(1);
		}
	} catch (error) {
		console.error("\n❌ Request failed:", error);
		process.exit(1);
	}
}

void testWebhook();
