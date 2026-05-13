import { Logger } from "@/core/config/logger";

import { ISubscriptionRepository, ISubscriptionService, SubscriptionData } from "../types";

export class SubscriptionService implements ISubscriptionService {
	constructor(
		private logger: Logger,
		private subscriptionRepository: ISubscriptionRepository,
	) {}

	async hasActiveSubscription(userId: string): Promise<boolean> {
		const subscription = await this.subscriptionRepository.findActiveByUserId(userId);
		const isActive = subscription !== null;

		this.logger.debug("Checked active subscription", { userId, isActive });
		return isActive;
	}

	async getActiveSubscription(userId: string): Promise<SubscriptionData | null> {
		return this.subscriptionRepository.findActiveByUserId(userId);
	}
}
