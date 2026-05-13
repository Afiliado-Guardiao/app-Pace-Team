import { Logger } from "@/core/config/logger";
import { normalizeReferralCode } from "@/utils/referralCode";

import { ReferralAlreadyUsedError, ReferralCodeNotFoundError, SelfReferralError } from "../errors";
import {
	ApplyReferralCodeResponse,
	IReferralRepository,
	IReferralService,
	ReferralStats,
} from "../types";

export class ReferralService implements IReferralService {
	constructor(
		private logger: Logger,
		private referralRepository: IReferralRepository,
	) {}

	async applyCode(userId: string, code: string): Promise<ApplyReferralCodeResponse> {
		// Defesa em profundidade — mesmo que Zod já normalize, invariante fica explícita.
		const normalizedCode = normalizeReferralCode(code);

		const snapshot = await this.referralRepository.getUserSnapshot(userId);
		if (!snapshot) {
			throw new ReferralCodeNotFoundError(normalizedCode);
		}

		if (snapshot.referredByCode !== null) {
			throw new ReferralAlreadyUsedError();
		}

		if (normalizedCode === snapshot.referralCode) {
			throw new SelfReferralError();
		}

		const referrer = await this.referralRepository.findUserByReferralCode(normalizedCode);
		if (!referrer) {
			throw new ReferralCodeNotFoundError(normalizedCode);
		}

		await this.referralRepository.setReferredByCode(userId, normalizedCode);

		this.logger.info("Referral applied", { userId, code: normalizedCode });

		return {
			usedCode: normalizedCode,
			referrer: { name: referrer.name },
		};
	}

	async getStats(userId: string): Promise<ReferralStats> {
		const snapshot = await this.referralRepository.getUserSnapshot(userId);
		if (!snapshot) {
			return { myCode: "", usedCode: null, referralsCount: 0 };
		}

		const referralsCount = await this.referralRepository.countReferrals(userId);

		this.logger.debug("Referral stats fetched", { userId, referralsCount });

		return {
			myCode: snapshot.referralCode,
			usedCode: snapshot.referredByCode,
			referralsCount,
		};
	}

	// Comissão de indicação a partir de assinatura paga: o webhook do Paywallo já é recebido em
	// `src/domain/subscription` (POST /webhooks/paywallo/:pathSecret). Para acoplar comissão aqui,
	// injete `IReferralService` no `WebhookProcessor` via `createSubscriptionModule(...)` e dispare
	// `referralService.recordCommission(userId, productId, amount)` quando `event.type === "INITIAL_PURCHASE"`
	// com `subscription.userId !== null`. Os campos de comissão (percentual, cap) ficam neste domínio.
}
