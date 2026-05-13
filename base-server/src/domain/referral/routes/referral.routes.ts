import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { IMiddleware } from "@/shared/types";
import { IRoute } from "@/shared/types";

import { ReferralController } from "../controllers/ReferralController";
import { ApplyReferralCodeRequest } from "../types";

export class ReferralRoutes implements IRoute {
	constructor(
		private referralController: ReferralController,
		private authMiddleware: IMiddleware,
	) {}

	private preHandler(
		request: FastifyRequest,
		reply: FastifyReply,
		done: (err?: Error) => void,
	): void {
		void this.authMiddleware
			.authenticate(request, reply)
			.then(() => {
				done();
			})
			.catch(done);
	}

	register(app: FastifyInstance): void {
		const pre = this.preHandler.bind(this);

		app.post<{ Body: ApplyReferralCodeRequest }>("/users/me/referral", {
			preHandler: pre,
			handler: (request, reply) => this.referralController.applyCode(request, reply),
		});

		app.get("/users/me/referral", {
			preHandler: pre,
			handler: (request, reply) => this.referralController.getStats(request, reply),
		});
	}
}
