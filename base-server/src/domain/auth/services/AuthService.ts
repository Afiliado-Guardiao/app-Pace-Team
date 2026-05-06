import { compare, hash } from "bcryptjs";
import * as jwt from "jsonwebtoken";

import { env } from "@/core/config/env";
import { Logger } from "@/core/config/logger";
import { generateReferralCode } from "@/utils/referralCode";

import { AUTH_CONSTANTS } from "../constants";
import {
	InvalidCredentialsError,
	InvalidTokenError,
	ReferralCodeGenerationError,
} from "../errors";
import {
	AuthResponse,
	IAuthRepository,
	IAuthService,
	JWTPayload,
	LoginRequest,
	RegisterRequest,
	SocialSignInRequest,
	UserData,
} from "../types";
import { hashSocialId } from "../utils/socialIdEncryption";

export class AuthService implements IAuthService {
	constructor(
		private logger: Logger,
		private authRepository: IAuthRepository,
	) {}

	async register(data: RegisterRequest): Promise<AuthResponse> {
		this.logger.info("Registration initiated", { email: data.email });
		const passwordHash = await hash(data.password, AUTH_CONSTANTS.SALT_ROUNDS);
		const referralCode = await this.generateUniqueReferralCode();
		const user = await this.authRepository.createUser({
			email: data.email,
			name: data.name,
			passwordHash,
			referralCode,
			birthday: data.birthday,
		});
		this.logger.info("Registration successful", { userId: user.id });
		return this.buildAuthResponse(user, user.loginVersion);
	}

	async login(data: LoginRequest): Promise<AuthResponse> {
		this.logger.info("Login initiated", { email: data.email });
		const user = await this.authRepository.findUserByEmail(data.email);
		if (!user) {
			// Retorna InvalidCredentialsError (401) em vez de UserNotFoundError (404)
			// para não vazar existência de usuário (user enumeration).
			this.logger.warn("Login failed: user not found", { email: data.email });
			throw new InvalidCredentialsError();
		}
		if (!user.passwordHash) {
			this.logger.warn("Login failed: no password set", { email: data.email });
			throw new InvalidCredentialsError();
		}
		const isPasswordValid = await compare(data.password, user.passwordHash);
		if (!isPasswordValid) {
			this.logger.warn("Login failed: invalid password", { email: data.email });
			throw new InvalidCredentialsError();
		}
		const newLoginVersion = await this.authRepository.incrementLoginVersion(user.id);
		this.logger.info("Login successful, previous sessions invalidated", { userId: user.id });
		return this.buildAuthResponse(user, newLoginVersion);
	}

	async authenticateWithSocial(data: SocialSignInRequest): Promise<AuthResponse> {
		this.logger.info("Social Sign In initiated", { provider: data.provider });
		const hashedSocialId = hashSocialId(data.socialId, data.provider);
		let user = await this.authRepository.findUserBySocialId(hashedSocialId);
		let loginVersion: number;
		if (!user) {
			user = await this.createSocialUser(data, hashedSocialId);
			loginVersion = user.loginVersion;
		} else {
			this.logger.info("Existing social user logging in", { userId: user.id, provider: data.provider });
			loginVersion = await this.authRepository.incrementLoginVersion(user.id);
		}
		this.logger.info("Social Sign In successful", { userId: user.id, provider: data.provider });
		return this.buildAuthResponse(user, loginVersion);
	}

	async logout(userId: string): Promise<void> {
		this.logger.info("Logout initiated", { userId });
		await this.authRepository.incrementLoginVersion(userId);
		this.logger.info("Logout successful, all sessions invalidated", { userId });
	}

	generateTokenForUser(payload: { userId: string; email: string | null; loginVersion: number }): string {
		const tokenPayload = {
			userId: payload.userId,
			email: payload.email,
			name: "",
			referralCode: "",
			referredByCode: null,
			loginVersion: payload.loginVersion,
		};
		return this.generateToken(tokenPayload);
	}

	verifyToken(token: string): JWTPayload {
		try {
			return this.decodeToken(token);
		} catch (error) {
			this.logger.warn("Token verification failed", { error });
			throw new InvalidTokenError();
		}
	}

	private async createSocialUser(data: SocialSignInRequest, hashedSocialId: string): Promise<UserData> {
		this.logger.info("Creating new social user", { provider: data.provider, email: data.email });
		const referralCode = await this.generateUniqueReferralCode();
		const user = await this.authRepository.createSocialUser({
			email: data.email ?? undefined,
			name: data.name || "User",
			socialId: hashedSocialId,
			socialProvider: data.provider,
			referralCode,
		});
		this.logger.info("Social user created", { userId: user.id, provider: data.provider });
		return user;
	}

	private buildAuthResponse(user: UserData, loginVersion: number): AuthResponse {
		const token = this.generateToken({
			userId: user.id,
			email: user.email,
			name: user.name,
			referralCode: user.referralCode,
			referredByCode: user.referredByCode,
			loginVersion,
		});
		return {
			token,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				socialId: user.socialId,
				socialProvider: user.socialProvider,
				referralCode: user.referralCode,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
		};
	}

	private async generateUniqueReferralCode(): Promise<string> {
		let referralCode = generateReferralCode();
		let isUnique = false;
		let attempts = 0;

		while (!isUnique && attempts < AUTH_CONSTANTS.MAX_REFERRAL_CODE_ATTEMPTS) {
			const existingUser = await this.authRepository.findUserByReferralCode(referralCode);
			if (!existingUser) {
				isUnique = true;
			} else {
				referralCode = generateReferralCode();
				attempts++;
				this.logger.warn("Referral code collision, generating new one", { attempts });
			}
		}

		if (!isUnique) {
			this.logger.error("Failed to generate unique referral code after max attempts");
			throw new ReferralCodeGenerationError();
		}

		return referralCode;
	}

	private generateToken(payload: {
		userId: string;
		email: string | null;
		name: string;
		referralCode: string;
		referredByCode: string | null;
		loginVersion: number;
	}): string {
		return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRATION } as jwt.SignOptions);
	}

	private decodeToken(token: string): JWTPayload {
		return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
	}
}
