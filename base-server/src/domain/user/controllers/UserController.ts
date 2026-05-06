import { FastifyReply, FastifyRequest } from "fastify";

import { UnauthorizedError } from "@/shared/errors";
import { AuthenticatedUser } from "@/shared/types";

import { IUserService, UpdateMeRequest, updateMeSchema, UpdatePasswordRequest, updatePasswordSchema } from "../types";

export class UserController {
	constructor(
		private userService: IUserService,
	) {}

	async getMe(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		const user = this.getAuthenticatedUser(request);
		const response = await this.userService.getMe(user.userId);
		void reply.status(200).send(response);
	}

	async updateMe(
		request: FastifyRequest<{ Body: UpdateMeRequest }>,
		reply: FastifyReply,
	): Promise<void> {
		const validatedData = updateMeSchema.parse(request.body);
		const user = this.getAuthenticatedUser(request);
		const response = await this.userService.updateMe(user.userId, validatedData);
		void reply.status(200).send(response);
	}

	async updatePassword(
		request: FastifyRequest<{ Body: UpdatePasswordRequest }>,
		reply: FastifyReply,
	): Promise<void> {
		const validatedData = updatePasswordSchema.parse(request.body);
		const user = this.getAuthenticatedUser(request);
		await this.userService.updatePassword(user.userId, validatedData);
		void reply.status(204).send();
	}

	async deleteMe(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		const user = this.getAuthenticatedUser(request);
		await this.userService.deleteMe(user.userId);
		void reply.status(204).send();
	}

	private getAuthenticatedUser(request: FastifyRequest): AuthenticatedUser {
		const user = (request as FastifyRequest & { user?: AuthenticatedUser }).user;
		if (!user) {
			throw new UnauthorizedError("Authentication required");
		}
		return user;
	}
}
