import { Prisma } from "@prisma/client";

import { Logger } from "@/core/config/logger";
import { Database } from "@/infrastructure/database/Database";

import { EmailAlreadyExistsError } from "../errors";
import { IUserRepository, UserData } from "../types";

export class UserRepository implements IUserRepository {
	constructor(
		private database: Database,
		private logger: Logger,
	) {}

	async findUserById(id: string): Promise<UserData | null> {
		try {
			const user = await this.database.getClient().user.findUnique({ where: { id } });
			return user;
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error("Failed to find user by ID", err);
			throw error;
		}
	}

	async updateProfile(
		id: string,
		data: Partial<Pick<UserData, "name" | "email" | "birthday">>,
	): Promise<UserData> {
		try {
			const user = await this.database.getClient().user.update({ where: { id }, data });
			this.logger.info("User profile updated", { userId: user.id });
			return user;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
				throw new EmailAlreadyExistsError();
			}
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error("Failed to update user profile", err);
			throw error;
		}
	}

	async updatePassword(id: string, passwordHash: string, loginVersion: number): Promise<void> {
		try {
			await this.database.getClient().user.update({
				where: { id },
				data: { passwordHash, loginVersion },
			});
			this.logger.info("User password updated", { userId: id });
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error("Failed to update password", err);
			throw error;
		}
	}

	async findUserByEmail(email: string): Promise<UserData | null> {
		try {
			const user = await this.database.getClient().user.findUnique({ where: { email } });
			return user;
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error("Failed to find user by email", err);
			throw error;
		}
	}

	async deleteUser(id: string): Promise<void> {
		try {
			await this.database.getClient().user.delete({ where: { id } });
			this.logger.info("User deleted", { userId: id });
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error("Failed to delete user", err);
			throw error;
		}
	}
}
