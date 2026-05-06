import { Onboarding, User } from "@prisma/client";

import { getDatabase } from "../helpers/database";

interface CreateOnboardingOptions {
	userId?: string | null;
	anonymousUserId?: string | null;
	name?: string | null;
	birthday?: string | null;
	email?: string | null;
	completed?: boolean;
	completedAt?: Date | null;
}

let onboardingCounter = 0;

export async function createOnboarding(options: CreateOnboardingOptions = {}): Promise<Onboarding> {
	const db = getDatabase();
	onboardingCounter++;

	const onboarding = await db.onboarding.create({
		data: {
			userId: options.userId || null,
			anonymousUserId: options.anonymousUserId || `anon-${onboardingCounter}`,
			name: options.name !== undefined ? options.name : `Test User ${onboardingCounter}`,
			birthday: options.birthday !== undefined ? options.birthday : "1990-01-01",
			email:
				options.email !== undefined ? options.email : `onboarding${onboardingCounter}@example.com`,
			completed: options.completed || false,
			completedAt: options.completedAt || null,
		},
	});

	return onboarding;
}

export async function createCompletedOnboarding(userId?: string): Promise<Onboarding> {
	return createOnboarding({
		userId: userId || null,
		completed: true,
		completedAt: new Date(),
	});
}

export async function createOnboardingWithUser(user: User): Promise<Onboarding> {
	return createOnboarding({
		userId: user.id,
		email: user.email,
	});
}

export async function createOnboardingWithSubscription(): Promise<Onboarding> {
	return createOnboarding({
		anonymousUserId: `anon-with-sub-${onboardingCounter + 1}`,
	});
}
