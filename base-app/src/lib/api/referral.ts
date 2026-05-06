import { apiClient } from "./client";
import { IApplyReferralResponse, IReferralStats } from "./types";

export interface IApplyReferralCodePayload {
	code: string;
}

export const applyReferralCode = async (
	payload: IApplyReferralCodePayload,
): Promise<IApplyReferralResponse> => {
	const response = await apiClient.post<IApplyReferralResponse>("/users/me/referral", payload);
	return response.data;
};

export const getReferralStats = async (): Promise<IReferralStats> => {
	const response = await apiClient.get<IReferralStats>("/users/me/referral");
	return response.data;
};
