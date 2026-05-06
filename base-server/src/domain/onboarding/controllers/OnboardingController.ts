import { FastifyReply, FastifyRequest } from "fastify";

import { AuthenticatedUser } from "@/shared/types";

import {
	CreateOnboardingRequest,
	createOnboardingRequestSchema,
	IOnboardingService,
	LinkToUserRequest,
	linkToUserRequestSchema,
	OnboardingIdParam,
	onboardingIdParamSchema,
	UpdateOnboardingRequest,
	updateOnboardingRequestSchema,
} from "../types";

export class OnboardingController {
	constructor(private onboardingService: IOnboardingService) {}

	async createOnboarding(
		request: FastifyRequest<{ Body: CreateOnboardingRequest }>,
		reply: FastifyReply,
	): Promise<void> {
		const { anonymousUserId } = createOnboardingRequestSchema.parse(request.body);
		const onboarding = await this.onboardingService.createOnboarding(anonymousUserId);
		void reply.status(201).send(onboarding);
	}

	async updateOnboarding(
		request: FastifyRequest<{ Params: OnboardingIdParam; Body: UpdateOnboardingRequest }>,
		reply: FastifyReply,
	): Promise<void> {
		const { id } = onboardingIdParamSchema.parse(request.params);
		const validatedData = updateOnboardingRequestSchema.parse(request.body);
		const onboarding = await this.onboardingService.updateOnboarding(id, validatedData);
		void reply.status(200).send(onboarding);
	}

	async getOnboarding(
		request: FastifyRequest<{ Params: OnboardingIdParam }>,
		reply: FastifyReply,
	): Promise<void> {
		const { id } = onboardingIdParamSchema.parse(request.params);
		const onboarding = await this.onboardingService.getOnboarding(id);
		void reply.status(200).send(onboarding);
	}

	async linkToUser(
		request: FastifyRequest<{ Body: LinkToUserRequest }>,
		reply: FastifyReply,
	): Promise<void> {
		const { onboardingId } = linkToUserRequestSchema.parse(request.body);

		const user = (request as FastifyRequest & { user?: AuthenticatedUser }).user;

		if (!user) {
			void reply.status(401).send({ error: "UNAUTHORIZED", message: "User not authenticated" });
			return;
		}

		const result = await this.onboardingService.linkToUser(onboardingId, user.userId);
		void reply.status(200).send(result);
	}
}
