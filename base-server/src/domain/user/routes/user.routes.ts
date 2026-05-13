import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { IMiddleware } from "@/shared/types";
import { IRoute } from "@/shared/types";

import { UserController } from "../controllers/UserController";
import { UpdateMeRequest, UpdatePasswordRequest } from "../types";

export class UserRoutes implements IRoute {
	constructor(
		private userController: UserController,
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

		app.get("/users/me", {
			preHandler: pre,
			handler: (request, reply) => this.userController.getMe(request, reply),
		});

		app.patch<{ Body: UpdateMeRequest }>("/users/me", {
			preHandler: pre,
			handler: (request, reply) => this.userController.updateMe(request, reply),
		});

		app.patch<{ Body: UpdatePasswordRequest }>("/users/me/password", {
			preHandler: pre,
			handler: (request, reply) => this.userController.updatePassword(request, reply),
		});

		app.delete("/users/me", {
			preHandler: pre,
			handler: (request, reply) => this.userController.deleteMe(request, reply),
		});
	}
}
