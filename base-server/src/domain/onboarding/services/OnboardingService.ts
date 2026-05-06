import { Logger } from "@/core/config/logger";
import { IUserData } from "@/shared/types";

import { OnboardingAlreadyLinkedError, OnboardingNotFoundError } from "../errors";
import {
	IOnboardingRepository,
	IOnboardingService,
	LinkToUserResult,
	OnboardingData,
	OnboardingResponse,
	UpdateOnboardingRequest,
} from "../types";

export class OnboardingService implements IOnboardingService {
	constructor(
		private logger: Logger,
		private onboardingRepository: IOnboardingRepository,
	) {}

	async createOnboarding(anonymousUserId: string): Promise<OnboardingResponse> {
		this.logger.info("Creating onboarding", { anonymousUserId });

		const existing = await this.onboardingRepository.findByAnonymousUserId(anonymousUserId);

		if (existing) {
			this.logger.info("Returning existing onboarding", {
				onboardingId: existing.id,
				anonymousUserId,
			});
			return existing;
		}

		const onboarding = await this.onboardingRepository.create(anonymousUserId);

		this.logger.info("Onboarding created", { onboardingId: onboarding.id });
		return onboarding;
	}

	async updateOnboarding(id: string, data: UpdateOnboardingRequest): Promise<OnboardingResponse> {
		this.logger.info("Updating onboarding", { onboardingId: id });

		const existing = await this.onboardingRepository.findById(id);

		if (!existing) {
			throw new OnboardingNotFoundError();
		}

		const updateData: typeof data & { completedAt?: Date } = { ...data };

		if (data.completed === true) {
			updateData.completedAt = new Date();
		}

		const updated = await this.onboardingRepository.update(id, updateData);

		this.logger.info("Onboarding updated", { onboardingId: id });
		return updated;
	}

	async getOnboarding(id: string): Promise<OnboardingResponse> {
		this.logger.info("Fetching onboarding", { onboardingId: id });

		const onboarding = await this.onboardingRepository.findById(id);

		if (!onboarding) {
			throw new OnboardingNotFoundError();
		}

		return onboarding;
	}

	async linkToUser(onboardingId: string, userId: string): Promise<LinkToUserResult> {
		this.logger.info("Linking onboarding to user", { onboardingId, userId });

		const onboarding = await this.onboardingRepository.findById(onboardingId);

		if (!onboarding) {
			throw new OnboardingNotFoundError();
		}

		if (onboarding.userId !== null && onboarding.userId !== userId) {
			throw new OnboardingAlreadyLinkedError();
		}

		const userPatch = this.buildUserPatch(onboarding);

		const result = await this.onboardingRepository.linkToUser(onboardingId, userId, userPatch);

		this.logger.info("Onboarding linked to user", { onboardingId, userId });
		return result;
	}

	private buildUserPatch(
		onboarding: OnboardingData,
	): Partial<Pick<IUserData, "name" | "email" | "birthday">> {
		const patch: Partial<Pick<IUserData, "name" | "email" | "birthday">> = {};

		if (onboarding.name) patch.name = onboarding.name;
		if (onboarding.email) patch.email = onboarding.email;
		if (onboarding.birthday) patch.birthday = onboarding.birthday;

		return patch;
	}
}
