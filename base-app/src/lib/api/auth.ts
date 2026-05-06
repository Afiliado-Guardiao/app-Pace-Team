import { apiClient } from "./client";
import { IAuthResponse, IUser } from "./types";

export interface IRegisterPayload {
	email: string;
	password: string;
	name: string;
	birthday?: string;
	onboardingId?: string;
}

export interface ILoginPayload {
	email: string;
	password: string;
}

export interface ISocialAuthPayload {
	provider: string;
	socialId: string;
	email?: string | null;
	name?: string | null;
}

export const register = async (payload: IRegisterPayload): Promise<IAuthResponse> => {
	const response = await apiClient.post<IAuthResponse>("/auth/register", payload);
	return response.data;
};

export const login = async (payload: ILoginPayload): Promise<IAuthResponse> => {
	const response = await apiClient.post<IAuthResponse>("/auth/login", payload);
	return response.data;
};

export const loginWithSocial = async (payload: ISocialAuthPayload): Promise<IAuthResponse> => {
	const response = await apiClient.post<IAuthResponse>("/auth/social", payload);
	return response.data;
};

export const logout = async (): Promise<void> => {
	await apiClient.post("/auth/logout");
};

export const getMe = async (): Promise<IUser> => {
	const response = await apiClient.get<IUser>("/auth/me");
	return response.data;
};

export const authApi = {
	register,
	login,
	loginWithEmail: login,
	loginWithSocial,
	logout,
	getMe,
};
