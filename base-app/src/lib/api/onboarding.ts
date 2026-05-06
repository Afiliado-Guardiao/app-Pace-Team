import { apiClient } from "./client";
import { IOnboarding } from "./types";

export interface ICreateOnboardingPayload {
	anonymousUserId: string;
}

export interface IUpdateOnboardingPayload {
	name?: string;
	email?: string;
	birthday?: string;
	completed?: boolean;
	currentStepIndex?: number;
	deviceLanguage?: string;
	deviceRegion?: string;
	deviceTimezone?: string;
}

export interface ILinkToUserPayload {
	onboardingId: string;
}

export const createOnboarding = async (
	payload: ICreateOnboardingPayload | string,
): Promise<IOnboarding> => {
	const body: ICreateOnboardingPayload =
		typeof payload === "string" ? { anonymousUserId: payload } : payload;
	const response = await apiClient.post<IOnboarding>("/onboarding", body);
	return response.data;
};

export const updateOnboarding = async (
	id: string,
	payload: IUpdateOnboardingPayload,
): Promise<IOnboarding> => {
	const response = await apiClient.patch<IOnboarding>(`/onboarding/${id}`, payload);
	return response.data;
};

export const getOnboardingById = async (id: string): Promise<IOnboarding> => {
	const response = await apiClient.get<IOnboarding>(`/onboarding/${id}`);
	return response.data;
};

export const linkOnboardingToUser = async (payload: ILinkToUserPayload): Promise<void> => {
	await apiClient.post("/onboarding/link-to-user", payload);
};

export const onboardingApi = {
	create: createOnboarding,
	createOnboarding,
	update: updateOnboarding,
	updateOnboarding,
	syncOnboarding: updateOnboarding,
	getById: getOnboardingById,
	getOnboardingById,
	linkToUser: linkOnboardingToUser,
	linkOnboardingToUser,
};

export type ISyncOnboardingPayload = IUpdateOnboardingPayload;
