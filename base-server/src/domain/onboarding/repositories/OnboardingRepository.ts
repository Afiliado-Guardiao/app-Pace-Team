import { Onboarding, User } from "@prisma/client";

import { Logger } from "@/core/config/logger";
import { Database } from "@/infrastructure/database/Database";
import { IUserData } from "@/shared/types";

import { IOnboardingRepository, OnboardingData, UpdateOnboardingRequest } from "../types";

type UpdateData = Partial<UpdateOnboardingRequest> & { completedAt?: Date | null; userId?: string };

export class OnboardingRepository implements IOnboardingRepository {
	constructor(
		private database: Database,
		private logger: Logger,
	) {}

	private mapToOnboardingData(onboarding: Onboarding): OnboardingData {
		return {
			id: onboarding.id,
			anonymousUserId: onboarding.anonymousUserId,
			userId: onboarding.userId,
			name: onboarding.name,
			email: onboarding.email,
			birthday: onboarding.birthday,
			completed: onboarding.completed,
			completedAt: onboarding.completedAt,
			createdAt: onboarding.createdAt,
			updatedAt: onboarding.updatedAt,
		};
	}

	private mapToIUserData(user: User): IUserData {
		return {
			id: user.id,
			email: user.email,
			name: user.name,
			birthday: user.birthday,
			passwordHash: user.passwordHash,
			socialId: user.socialId,
			socialProvider: user.socialProvider,
			referralCode: user.referralCode,
			referredByCode: user.referredByCode,
			loginVersion: user.loginVersion,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}

	async create(anonymousUserId: string): Promise<OnboardingData> {
		try {
			const onboarding = await this.database.getClient().onboarding.create({
				data: { anonymousUserId },
			});

			this.logger.info("Onboarding created", { onboardingId: onboarding.id, anonymousUserId });
			return this.mapToOnboardingData(onboarding);
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error("Failed to create onboarding", err);
			throw error;
		}
	}

	async findById(id: string): Promise<OnboardingData | null> {
		const onboarding = await this.database.getClient().onboarding.findUnique({ where: { id } });
		return onboarding ? this.mapToOnboardingData(onboarding) : null;
	}

	async findByAnonymousUserId(anonymousUserId: string): Promise<OnboardingData | null> {
		const onboarding = await this.database.getClient().onboarding.findUnique({
			where: { anonymousUserId },
		});
		return onboarding ? this.mapToOnboardingData(onboarding) : null;
	}

	async update(id: string, data: UpdateData): Promise<OnboardingData> {
		try {
			const onboarding = await this.database.getClient().onboarding.update({
				where: { id },
				data,
			});

			this.logger.info("Onboarding updated", { onboardingId: onboarding.id });
			return this.mapToOnboardingData(onboarding);
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error("Failed to update onboarding", err);
			throw error;
		}
	}

	async linkToUser(
		onboardingId: string,
		userId: string,
		userPatch: Partial<Pick<IUserData, "name" | "email" | "birthday">>,
	): Promise<{ onboarding: OnboardingData; user: IUserData }> {
		try {
			const now = new Date();

			const [onboarding, user] = await this.database.getClient().$transaction([
				this.database.getClient().onboarding.update({
					where: { id: onboardingId },
					data: { userId, completed: true, completedAt: now },
				}),
				this.database.getClient().user.update({
					where: { id: userId },
					data: Object.keys(userPatch).length > 0 ? userPatch : {},
				}),
			]);

			this.logger.info("Onboarding linked to user", { onboardingId, userId });
			return {
				onboarding: this.mapToOnboardingData(onboarding),
				user: this.mapToIUserData(user),
			};
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error("Failed to link onboarding to user", err);
			throw error;
		}
	}
}
