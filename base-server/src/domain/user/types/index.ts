import { z } from "zod";

import { VALIDATION_CONSTANTS } from "@/shared/constants";

export interface UserData {
	id: string;
	email: string | null;
	name: string;
	birthday: string | null;
	passwordHash: string | null;
	socialId: string | null;
	socialProvider: string | null;
	referralCode: string;
	referredByCode: string | null;
	loginVersion: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserProfileResponse {
	id: string;
	email: string | null;
	name: string;
	birthday: string | null;
	referralCode: string;
	createdAt: Date;
	updatedAt: Date;
}

export const updateMeSchema = z.object({
	name: z
		.string()
		.min(VALIDATION_CONSTANTS.MIN_NAME_LENGTH, "Name must be at least 2 characters")
		.optional(),
	email: z.string().email("Invalid email format").optional(),
	birthday: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, "Birthday must be in YYYY-MM-DD format")
		.optional(),
});

export type UpdateMeRequest = z.infer<typeof updateMeSchema>;

export const updatePasswordSchema = z.object({
	currentPassword: z
		.string()
		.min(VALIDATION_CONSTANTS.MIN_REQUIRED_LENGTH, "Current password is required"),
	newPassword: z
		.string()
		.min(VALIDATION_CONSTANTS.MIN_PASSWORD_LENGTH, "New password must be at least 8 characters"),
});

export type UpdatePasswordRequest = z.infer<typeof updatePasswordSchema>;

export interface IUserService {
	getMe(userId: string): Promise<UserProfileResponse>;
	updateMe(userId: string, data: UpdateMeRequest): Promise<UserProfileResponse>;
	updatePassword(userId: string, data: UpdatePasswordRequest): Promise<void>;
	deleteMe(userId: string): Promise<void>;
}

export interface IUserRepository {
	findUserById(id: string): Promise<UserData | null>;
	updateProfile(
		id: string,
		data: Partial<Pick<UserData, "name" | "email" | "birthday">>,
	): Promise<UserData>;
	updatePassword(id: string, passwordHash: string, loginVersion: number): Promise<void>;
	findUserByEmail(email: string): Promise<UserData | null>;
	deleteUser(id: string): Promise<void>;
}
