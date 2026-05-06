import { Prisma } from "@prisma/client";

import { Logger } from "@/core/config/logger";
import { Database } from "@/infrastructure/database/Database";

import { EmailAlreadyExistsError } from "../errors";
import { IAuthRepository, UserData } from "../types";

export class AuthRepository implements IAuthRepository {
	constructor(
		private database: Database,
		private logger: Logger,
	) {}

	async createUser(data: {
		email: string;
		name: string;
		passwordHash: string;
		referralCode: string;
		birthday?: string;
		referredByCode?: string;
	}): Promise<UserData> {
		try {
			const user = await this.database.getClient().user.create({
				data: {
					email: data.email,
					name: data.name,
					passwordHash: data.passwordHash,
					referralCode: data.referralCode,
					birthday: data.birthday,
					referredByCode: data.referredByCode,
					loginVersion: 1,
				},
			});

			this.logger.info("User created successfully", { userId: user.id });
			return user;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
				throw new EmailAlreadyExistsError();
			}
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error("Failed to create user", err);
			throw error;
		}
	}

	async findUserByEmail(email: string): Promise<UserData | null> {
		return this.database.getClient().user.findUnique({ where: { email } });
	}

	async findUserById(id: string): Promise<UserData | null> {
		return this.database.getClient().user.findUnique({ where: { id } });
	}

	async findUserBySocialId(socialId: string): Promise<UserData | null> {
		return this.database.getClient().user.findUnique({ where: { socialId } });
	}

	async findUserByReferralCode(referralCode: string): Promise<UserData | null> {
		return this.database.getClient().user.findUnique({ where: { referralCode } });
	}

	async createSocialUser(data: {
		email?: string;
		name: string;
		socialId: string;
		socialProvider: string;
		referralCode: string;
	}): Promise<UserData> {
		try {
			const user = await this.database.getClient().user.create({
				data: {
					email: data.email,
					name: data.name,
					socialId: data.socialId,
					socialProvider: data.socialProvider,
					referralCode: data.referralCode,
					loginVersion: 1,
				},
			});

			this.logger.info("Social user created successfully", { userId: user.id });
			return user;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
				throw new EmailAlreadyExistsError();
			}
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error("Failed to create social user", err);
			throw error;
		}
	}

	async incrementLoginVersion(userId: string): Promise<number> {
		try {
			const updated = await this.database.getClient().user.update({
				where: { id: userId },
				data: { loginVersion: { increment: 1 } },
				select: { loginVersion: true },
			});

			this.logger.info("Login version incremented", { userId });
			return updated.loginVersion;
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error("Failed to increment login version", err);
			throw error;
		}
	}

	async findUserLoginVersion(userId: string): Promise<number> {
		try {
			const user = await this.database.getClient().user.findUnique({
				where: { id: userId },
				select: { loginVersion: true },
			});

			if (!user) {
				this.logger.warn("User not found when fetching login version", { userId });
				return 1;
			}

			return user.loginVersion;
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error("Failed to fetch login version", err);
			return 1;
		}
	}

	async validateLoginVersion(userId: string, version: number): Promise<boolean> {
		try {
			const user = await this.database.getClient().user.findUnique({
				where: { id: userId },
				select: { loginVersion: true },
			});

			if (!user) {
				this.logger.warn("User not found when validating login version", { userId });
				return false;
			}

			const isValid = user.loginVersion === version;

			if (!isValid) {
				this.logger.warn("Login version mismatch", {
					userId,
					expected: user.loginVersion,
					provided: version,
				});
			}

			return isValid;
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error("Failed to validate login version", err);
			return false;
		}
	}
}
