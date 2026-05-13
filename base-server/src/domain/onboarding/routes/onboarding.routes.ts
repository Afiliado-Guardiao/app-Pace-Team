import { FastifyInstance } from "fastify";

import { IMiddleware, IRoute } from "@/shared/types";

import { OnboardingController } from "../controllers/OnboardingController";
import { CreateOnboardingRequest, OnboardingIdParam, UpdateOnboardingRequest } from "../types";

export class OnboardingRoutes implements IRoute {
	constructor(
		private onboardingController: OnboardingController,
		private authMiddleware: IMiddleware,
	) {}

	register(app: FastifyInstance): void {
		app.post<{ Body: CreateOnboardingRequest }>("/onboarding", {
			handler: async (request, reply) => {
				return this.onboardingController.createOnboarding(request, reply);
			},
		});

		app.patch<{ Params: OnboardingIdParam; Body: UpdateOnboardingRequest }>("/onboarding/:id", {
			handler: async (request, reply) => {
				return this.onboardingController.updateOnboarding(request, reply);
			},
		});

		app.get<{ Params: OnboardingIdParam }>("/onboarding/:id", {
			handler: async (request, reply) => {
				return this.onboardingController.getOnboarding(request, reply);
			},
		});

		app.post<{ Body: { onboardingId: string } }>("/onboarding/link-to-user", {
			preHandler: (request, reply, done) => {
				void this.authMiddleware
					.authenticate(request, reply)
					.then(() => {
						done();
					})
					.catch(done);
			},
			handler: async (request, reply) => {
				return this.onboardingController.linkToUser(request, reply);
			},
		});
	}
}
