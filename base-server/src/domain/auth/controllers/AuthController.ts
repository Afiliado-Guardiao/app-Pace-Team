import { FastifyReply, FastifyRequest } from "fastify";

import { AuthenticatedUser } from "@/shared/types";

import {
	IAuthService,
	LoginRequest,
	loginSchema,
	RegisterRequest,
	registerSchema,
	SocialSignInRequest,
	socialSignInSchema,
} from "../types";

export class AuthController {
	constructor(private authService: IAuthService) {}

	async register(
		request: FastifyRequest<{ Body: RegisterRequest }>,
		reply: FastifyReply,
	): Promise<void> {
		const validatedData = registerSchema.parse(request.body);
		const response = await this.authService.register(validatedData);
		void reply.status(201).send(response);
	}

	async login(request: FastifyRequest<{ Body: LoginRequest }>, reply: FastifyReply): Promise<void> {
		const validatedData = loginSchema.parse(request.body);
		const response = await this.authService.login(validatedData);
		void reply.status(200).send(response);
	}

	async socialSignIn(
		request: FastifyRequest<{ Body: SocialSignInRequest }>,
		reply: FastifyReply,
	): Promise<void> {
		const validatedData = socialSignInSchema.parse(request.body);
		const response = await this.authService.authenticateWithSocial(validatedData);
		void reply.status(200).send(response);
	}

	async logout(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		const authenticatedRequest = request as FastifyRequest & { user?: AuthenticatedUser };
		const user = authenticatedRequest.user;

		if (!user) {
			void reply.status(401).send({ error: "UNAUTHORIZED", message: "Authentication required" });
			return;
		}

		await this.authService.logout(user.userId);
		void reply.status(204).send();
	}

	me(request: FastifyRequest, reply: FastifyReply): void {
		const user = (request as FastifyRequest & { user?: AuthenticatedUser }).user;

		if (!user) {
			void reply.status(401).send({ error: "UNAUTHORIZED", message: "Authentication required" });
			return;
		}

		void reply.status(200).send({ user });
	}
}
