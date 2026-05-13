import { Subscription } from "@prisma/client";

import { getDatabase } from "../helpers/database";

interface CreateSubscriptionOptions {
	userId?: string | null;
	anonymousUserId?: string | null;
	productId?: string;
	status?: string;
	store?: string;
	environment?: string;
	isTrial?: boolean;
	startedAt?: Date;
	expiresAt?: Date | null;
	cancelledAt?: Date | null;
	originalTransactionId?: string;
	lastEventId?: string | null;
}

let subscriptionCounter = 0;

export async function createSubscription(
	options: CreateSubscriptionOptions = {},
): Promise<Subscription> {
	const db = getDatabase();
	subscriptionCounter++;

	const now = new Date();

	return db.subscription.create({
		data: {
			userId: options.userId ?? null,
			anonymousUserId: options.anonymousUserId ?? null,
			productId: options.productId ?? "premium_monthly",
			status: options.status ?? "active",
			store: options.store ?? "APP_STORE",
			environment: options.environment ?? "SANDBOX",
			isTrial: options.isTrial ?? false,
			startedAt: options.startedAt ?? now,
			expiresAt:
				options.expiresAt !== undefined
					? options.expiresAt
					: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
			cancelledAt: options.cancelledAt ?? null,
			originalTransactionId:
				options.originalTransactionId ?? `tx-original-${String(subscriptionCounter)}`,
			lastEventId: options.lastEventId ?? null,
		},
	});
}
