import { Subscription } from "@prisma/client";

import { Logger } from "@/core/config/logger";
import { Database } from "@/infrastructure/database/Database";

import {
	ISubscriptionRepository,
	SubscriptionData,
	SubscriptionStatus,
	UpsertSubscriptionInput,
} from "../types";

export class SubscriptionRepository implements ISubscriptionRepository {
	constructor(
		private database: Database,
		private logger: Logger,
	) {}

	private mapToSubscriptionData(subscription: Subscription): SubscriptionData {
		return {
			id: subscription.id,
			userId: subscription.userId,
			anonymousUserId: subscription.anonymousUserId,
			productId: subscription.productId,
			status: subscription.status as SubscriptionStatus,
			store: subscription.store,
			environment: subscription.environment,
			isTrial: subscription.isTrial,
			startedAt: subscription.startedAt,
			expiresAt: subscription.expiresAt,
			cancelledAt: subscription.cancelledAt,
			originalTransactionId: subscription.originalTransactionId,
			lastEventId: subscription.lastEventId,
			createdAt: subscription.createdAt,
			updatedAt: subscription.updatedAt,
		};
	}

	async upsertByOriginalTransactionId(input: UpsertSubscriptionInput): Promise<SubscriptionData> {
		const subscription = await this.database.getClient().subscription.upsert({
			where: { originalTransactionId: input.originalTransactionId },
			update: {
				userId: input.userId,
				anonymousUserId: input.anonymousUserId,
				productId: input.productId,
				status: input.status,
				store: input.store,
				environment: input.environment,
				isTrial: input.isTrial,
				expiresAt: input.expiresAt,
				cancelledAt: input.cancelledAt,
				lastEventId: input.lastEventId,
			},
			create: input,
		});

		this.logger.info("Subscription upserted", {
			subscriptionId: subscription.id,
			status: subscription.status,
			productId: subscription.productId,
		});

		return this.mapToSubscriptionData(subscription);
	}

	async findActiveByUserId(userId: string): Promise<SubscriptionData | null> {
		const subscription = await this.database.getClient().subscription.findFirst({
			where: {
				userId,
				status: { in: ["active", "in_grace_period", "in_billing_retry"] },
			},
			orderBy: { startedAt: "desc" },
		});

		return subscription ? this.mapToSubscriptionData(subscription) : null;
	}

	async findByOriginalTransactionId(
		originalTransactionId: string,
	): Promise<SubscriptionData | null> {
		const subscription = await this.database.getClient().subscription.findUnique({
			where: { originalTransactionId },
		});

		return subscription ? this.mapToSubscriptionData(subscription) : null;
	}

	async setUserPremium(userId: string, isPremium: boolean): Promise<void> {
		await this.database.getClient().user.update({
			where: { id: userId },
			data: { isPremium },
		});

		this.logger.info("User isPremium flag updated", { userId, isPremium });
	}

	async wasEventProcessed(eventId: string): Promise<boolean> {
		const existing = await this.database.getClient().webhookEvent.findUnique({
			where: { eventId },
			select: { id: true },
		});

		return existing !== null;
	}

	async markEventProcessed(eventId: string, eventType: string, payload: unknown): Promise<void> {
		await this.database.getClient().webhookEvent.create({
			data: {
				eventId,
				eventType,
				payload: payload as object,
			},
		});
	}

	async findUserByAnonymousId(anonymousUserId: string): Promise<{ id: string } | null> {
		const onboarding = await this.database.getClient().onboarding.findUnique({
			where: { anonymousUserId },
			select: { userId: true },
		});

		if (!onboarding?.userId) return null;
		return { id: onboarding.userId };
	}
}
