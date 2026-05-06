import { User } from "@prisma/client";
import { hash } from "bcryptjs";

import { SECURITY_CONSTANTS } from "@/shared/constants";
import { generateReferralCode } from "@/utils/referralCode";

import { getDatabase } from "../helpers/database";

interface CreateUserOptions {
	email?: string | null;
	name?: string;
	password?: string;
	socialId?: string | null;
	socialProvider?: string | null;
	referralCode?: string;
	referredByCode?: string | null;
	loginVersion?: number;
}

let userCounter = 0;

export async function createUser(options: CreateUserOptions = {}): Promise<User> {
	const db = getDatabase();
	userCounter++;

	const password = options.password || "Test@123";
	const passwordHash = await hash(password, SECURITY_CONSTANTS.SALT_ROUNDS);

	const user = await db.user.create({
		data: {
			email: options.email !== undefined ? options.email : `user${userCounter}@example.com`,
			name: options.name || `Test User ${userCounter}`,
			passwordHash: options.socialId ? null : passwordHash,
			socialId: options.socialId || null,
			socialProvider: options.socialProvider || null,
			referralCode: options.referralCode || generateReferralCode(),
			referredByCode: options.referredByCode || null,
			loginVersion: options.loginVersion || 1,
		},
	});

	return user;
}

export async function createSocialUser(provider: "apple" | "google" = "apple"): Promise<User> {
	userCounter++;
	return createUser({
		email: null,
		socialId: `social-id-${userCounter}`,
		socialProvider: provider,
	});
}

export async function createUserWithReferral(): Promise<{ user: User; referrer: User }> {
	const referrer = await createUser();

	const user = await createUser({
		referredByCode: referrer.referralCode,
	});

	return { user, referrer };
}
