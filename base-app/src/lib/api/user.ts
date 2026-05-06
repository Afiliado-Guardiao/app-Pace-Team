import { apiClient } from "./client";
import { IUser } from "./types";

export interface IUpdateMePayload {
	name?: string;
	email?: string;
	birthday?: string;
}

export interface IUpdatePasswordPayload {
	currentPassword: string;
	newPassword: string;
}

export const getUserMe = async (): Promise<IUser> => {
	const response = await apiClient.get<IUser>("/users/me");
	return response.data;
};

export const updateMe = async (payload: IUpdateMePayload): Promise<IUser> => {
	const response = await apiClient.patch<IUser>("/users/me", payload);
	return response.data;
};

export const updatePassword = async (payload: IUpdatePasswordPayload): Promise<void> => {
	await apiClient.patch("/users/me/password", payload);
};

export const deleteMe = async (): Promise<void> => {
	await apiClient.delete("/users/me");
};
