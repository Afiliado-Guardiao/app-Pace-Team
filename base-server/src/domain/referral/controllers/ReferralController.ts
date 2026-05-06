import { FastifyReply, FastifyRequest } from "fastify";

import { AuthenticatedUser } from "@/shared/types";

import { ApplyReferralCodeRequest, applyReferralCodeSchema, IReferralService } from "../types";

export class ReferralController {
	constructor(private referralService: IReferralService) {}

	async applyCode(
		request: FastifyRequest<{ Body: ApplyReferralCodeRequest }>,
		reply: FastifyReply,
	): Promise<void> {
		const body = applyReferralCodeSchema.parse(request.body);
		const user = (request as FastifyRequest & { user: AuthenticatedUser }).user;

		const response = await this.referralService.applyCode(user.userId, body.code);

		void reply.status(200).send(response);
	}

	async getStats(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		const user = (request as FastifyRequest & { user: AuthenticatedUser }).user;

		const stats = await this.referralService.getStats(user.userId);

		void reply.status(200).send(stats);
	}
}
