import { z } from "zod";

import { normalizeReferralCode } from "@/utils/referralCode";

export const applyReferralCodeSchema = z.object({
	code: z
		.string()
		.transform((v) => normalizeReferralCode(v))
		.pipe(
			z
				.string()
				.min(4, "Code must be at least 4 characters")
				.max(20, "Code must be at most 20 characters")
				.regex(/^[A-Z0-9]+$/, "Code must contain only letters and numbers"),
		),
});

export type ApplyReferralCodeRequest = z.infer<typeof applyReferralCodeSchema>;

export interface ReferralStats {
	myCode: string;
	usedCode: string | null;
	referralsCount: number;
}

export interface ReferrerInfo {
	name: string;
}

export interface ReferrerLookup {
	id: string;
	name: string;
}

export interface ApplyReferralCodeResponse {
	usedCode: string;
	referrer: ReferrerInfo;
}

export interface IUserReferralSnapshot {
	referralCode: string;
	referredByCode: string | null;
	referredById: string | null;
}

export interface IReferralRepository {
	findUserByReferralCode(code: string): Promise<ReferrerLookup | null>;
	setReferredByCode(userId: string, code: string): Promise<void>;
	countReferrals(userId: string): Promise<number>;
	getUserSnapshot(userId: string): Promise<IUserReferralSnapshot | null>;
}

export interface IReferralService {
	applyCode(userId: string, code: string): Promise<ApplyReferralCodeResponse>;
	getStats(userId: string): Promise<ReferralStats>;
}
