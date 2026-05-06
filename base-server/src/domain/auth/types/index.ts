import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { VALIDATION_CONSTANTS } from "@/shared/constants";

export const registerSchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z
		.string()
		.min(VALIDATION_CONSTANTS.MIN_PASSWORD_LENGTH, "Password must be at least 8 characters"),
	name: z.string().min(VALIDATION_CONSTANTS.MIN_NAME_LENGTH, "Name must be at least 2 characters"),
	birthday: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, "Birthday must be in YYYY-MM-DD format")
		.optional(),
});

export type RegisterRequest = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z.string().min(VALIDATION_CONSTANTS.MIN_REQUIRED_LENGTH, "Password is required"),
});

export type LoginRequest = z.infer<typeof loginSchema>;

export const socialSignInSchema = z.object({
	provider: z.enum(["apple", "google"]),
	socialId: z.string().min(VALIDATION_CONSTANTS.MIN_REQUIRED_LENGTH, "Social ID is required"),
	email: z.string().email().nullable().optional(),
	name: z.string().nullable().optional(),
});

export type SocialSignInRequest = z.infer<typeof socialSignInSchema>;

export interface AuthResponse {
	token: string;
	user: {
		id: string;
		email: string | null;
		name: string;
		socialId: string | null;
		socialProvider: string | null;
		referralCode: string;
		createdAt: Date;
		updatedAt: Date;
	};
}

export interface JWTPayload {
	userId: string;
	email: string | null;
	name: string;
	referralCode: string;
	referredByCode: string | null;
	loginVersion: number;
	iat: number;
	exp: number;
}

export interface UserData {
	id: string;
	email: string | null;
	name: string;
	passwordHash: string | null;
	socialId: string | null;
	socialProvider: string | null;
	referralCode: string;
	referredByCode: string | null;
	loginVersion: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface IAuthService {
	register(data: RegisterRequest): Promise<AuthResponse>;
	login(data: LoginRequest): Promise<AuthResponse>;
	authenticateWithSocial(data: SocialSignInRequest): Promise<AuthResponse>;
	logout(userId: string): Promise<void>;
	verifyToken(token: string): JWTPayload;
	generateTokenForUser(payload: {
		userId: string;
		email: string | null;
		loginVersion: number;
	}): string;
}

export interface IAuthMiddleware {
	authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export interface IAuthRepository {
	createUser(data: {
		email: string;
		name: string;
		passwordHash: string;
		referralCode: string;
		birthday?: string;
		referredByCode?: string;
	}): Promise<UserData>;
	findUserByEmail(email: string): Promise<UserData | null>;
	findUserById(id: string): Promise<UserData | null>;
	findUserBySocialId(socialId: string): Promise<UserData | null>;
	findUserByReferralCode(referralCode: string): Promise<UserData | null>;
	createSocialUser(data: {
		email?: string;
		name: string;
		socialId: string;
		socialProvider: string;
		referralCode: string;
	}): Promise<UserData>;
	incrementLoginVersion(userId: string): Promise<number>;
	findUserLoginVersion(userId: string): Promise<number>;
	validateLoginVersion(userId: string, version: number): Promise<boolean>;
}
