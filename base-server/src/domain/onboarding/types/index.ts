import { z } from "zod";

import { IUserData } from "@/shared/types";

export const createOnboardingRequestSchema = z.object({
	anonymousUserId: z.string().min(1),
});

export type CreateOnboardingRequest = z.infer<typeof createOnboardingRequestSchema>;

export const updateOnboardingRequestSchema = z
	.object({
		name: z.string().min(2).max(100).optional(),
		birthday: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, "Birthday must be in YYYY-MM-DD format")
			.optional(),
		email: z.string().email().optional(),
		completed: z.boolean().optional(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field must be provided",
	});

export type UpdateOnboardingRequest = z.infer<typeof updateOnboardingRequestSchema>;

export const onboardingIdParamSchema = z.object({
	id: z.string().uuid("Invalid onboarding ID format"),
});

export type OnboardingIdParam = z.infer<typeof onboardingIdParamSchema>;

export const linkToUserRequestSchema = z.object({
	onboardingId: z.string().uuid("Invalid onboarding ID format"),
});

export type LinkToUserRequest = z.infer<typeof linkToUserRequestSchema>;

export interface OnboardingData {
	id: string;
	anonymousUserId: string | null;
	name: string | null;
	birthday: string | null;
	email: string | null;
	completed: boolean;
	completedAt: Date | null;
	userId: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export type OnboardingResponse = OnboardingData;

export interface LinkToUserResult {
	onboarding: OnboardingData;
	user: IUserData;
}

export interface IOnboardingRepository {
	create(anonymousUserId: string): Promise<OnboardingData>;
	findById(id: string): Promise<OnboardingData | null>;
	findByAnonymousUserId(anonymousUserId: string): Promise<OnboardingData | null>;
	update(id: string, data: Partial<UpdateOnboardingRequest> & { completedAt?: Date | null; userId?: string }): Promise<OnboardingData>;
	linkToUser(onboardingId: string, userId: string, userPatch: Partial<Pick<IUserData, "name" | "email" | "birthday">>): Promise<{ onboarding: OnboardingData; user: IUserData }>;
}

export interface IOnboardingService {
	createOnboarding(anonymousUserId: string): Promise<OnboardingResponse>;
	updateOnboarding(id: string, data: UpdateOnboardingRequest): Promise<OnboardingResponse>;
	getOnboarding(id: string): Promise<OnboardingResponse>;
	linkToUser(onboardingId: string, userId: string): Promise<LinkToUserResult>;
}
