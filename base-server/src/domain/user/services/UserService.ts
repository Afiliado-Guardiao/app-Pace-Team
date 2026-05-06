import { compare, hash } from "bcryptjs";

import { Logger } from "@/core/config/logger";

import { USER_CONSTANTS } from "../constants";
import { EmailAlreadyExistsError, InvalidPasswordError, UserNotFoundError } from "../errors";
import {
	IUserRepository,
	IUserService,
	UpdateMeRequest,
	UpdatePasswordRequest,
	UserProfileResponse,
} from "../types";

export class UserService implements IUserService {
	constructor(
		private logger: Logger,
		private userRepository: IUserRepository,
	) {}

	async getMe(userId: string): Promise<UserProfileResponse> {
		this.logger.info("Get me initiated", { userId });

		const user = await this.userRepository.findUserById(userId);

		if (!user) {
			this.logger.warn("User not found", { userId });
			throw new UserNotFoundError();
		}

		return this.toProfileResponse(user);
	}

	async updateMe(userId: string, data: UpdateMeRequest): Promise<UserProfileResponse> {
		this.logger.info("Update me initiated", { userId });

		const user = await this.userRepository.findUserById(userId);

		if (!user) {
			this.logger.warn("User not found", { userId });
			throw new UserNotFoundError();
		}

		if (data.email && data.email !== user.email) {
			const existing = await this.userRepository.findUserByEmail(data.email);
			if (existing && existing.id !== userId) {
				this.logger.warn("Email already in use", { email: data.email });
				throw new EmailAlreadyExistsError();
			}
		}

		const updated = await this.userRepository.updateProfile(userId, data);

		this.logger.info("User profile updated", { userId });

		return this.toProfileResponse(updated);
	}

	async updatePassword(userId: string, data: UpdatePasswordRequest): Promise<void> {
		this.logger.info("Update password initiated", { userId });

		const user = await this.userRepository.findUserById(userId);

		if (!user) {
			this.logger.warn("User not found", { userId });
			throw new UserNotFoundError();
		}

		if (!user.passwordHash) {
			this.logger.warn("User has no password (social login)", { userId });
			throw new InvalidPasswordError();
		}

		const isValid = await compare(data.currentPassword, user.passwordHash);

		if (!isValid) {
			this.logger.warn("Invalid current password", { userId });
			throw new InvalidPasswordError();
		}

		const newHash = await hash(data.newPassword, USER_CONSTANTS.SALT_ROUNDS);
		const newLoginVersion = user.loginVersion + 1;

		await this.userRepository.updatePassword(userId, newHash, newLoginVersion);

		this.logger.info("Password updated, sessions invalidated", { userId });
	}

	async deleteMe(userId: string): Promise<void> {
		this.logger.info("Delete me initiated", { userId });

		const user = await this.userRepository.findUserById(userId);

		if (!user) {
			this.logger.warn("User not found", { userId });
			throw new UserNotFoundError();
		}

		await this.userRepository.deleteUser(userId);

		this.logger.info("User deleted", { userId });
	}

	private toProfileResponse(user: {
		id: string;
		email: string | null;
		name: string;
		birthday: string | null;
		referralCode: string;
		createdAt: Date;
		updatedAt: Date;
	}): UserProfileResponse {
		return {
			id: user.id,
			email: user.email,
			name: user.name,
			birthday: user.birthday,
			referralCode: user.referralCode,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}
}
