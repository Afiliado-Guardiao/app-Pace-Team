import { Logger } from "@/core/config/logger";
import { Database } from "@/infrastructure/database/Database";

import { IReferralRepository, IUserReferralSnapshot, ReferrerLookup } from "../types";

export class ReferralRepository implements IReferralRepository {
	constructor(
		private database: Database,
		private logger: Logger,
	) {}

	async findUserByReferralCode(code: string): Promise<ReferrerLookup | null> {
		const user = await this.database.getClient().user.findUnique({
			where: { referralCode: code },
			select: { id: true, name: true },
		});

		if (!user) {
			return null;
		}

		return { id: user.id, name: user.name };
	}

	async setReferredByCode(userId: string, code: string): Promise<void> {
		const referrer = await this.database.getClient().user.findUnique({
			where: { referralCode: code },
			select: { id: true },
		});

		await this.database.getClient().user.update({
			where: { id: userId },
			data: {
				referredByCode: code,
				referredById: referrer?.id ?? null,
			},
		});

		this.logger.info("Referral code applied", { userId, code });
	}

	async countReferrals(userId: string): Promise<number> {
		return this.database.getClient().user.count({
			where: { referredById: userId },
		});
	}

	async getUserSnapshot(userId: string): Promise<IUserReferralSnapshot | null> {
		const user = await this.database.getClient().user.findUnique({
			where: { id: userId },
			select: { referralCode: true, referredByCode: true, referredById: true },
		});

		return user;
	}
}
