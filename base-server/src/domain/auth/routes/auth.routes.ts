import { FastifyInstance } from "fastify";

import { env } from "@/core/config/env";
import { IRoute } from "@/shared/types";

import { AuthController } from "../controllers/AuthController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { LoginRequest, RegisterRequest, SocialSignInRequest } from "../types";

export class AuthRoutes implements IRoute {
	constructor(
		private authController: AuthController,
		private authMiddleware: AuthMiddleware,
	) {}

	register(app: FastifyInstance): void {
		// Rate limit mais restrito: brute-force protection (ver AUTH_RATE_LIMIT no .env.example)
		// 429 retornado com o default do @fastify/rate-limit (sem errorResponseBuilder customizado neste escopo)
		app.post<{ Body: RegisterRequest }>("/auth/register", {
			config: { rateLimit: { max: env.AUTH_RATE_LIMIT, timeWindow: 60000 } },
			handler: async (request, reply) => {
				return this.authController.register(request, reply);
			},
		});

		app.post<{ Body: LoginRequest }>("/auth/login", {
			config: { rateLimit: { max: env.AUTH_RATE_LIMIT, timeWindow: 60000 } },
			handler: async (request, reply) => {
				return this.authController.login(request, reply);
			},
		});

		app.post<{ Body: SocialSignInRequest }>("/auth/social", {
			handler: async (request, reply) => {
				return this.authController.socialSignIn(request, reply);
			},
		});

		app.get("/auth/me", {
			preHandler: (request, reply, done) => {
				void this.authMiddleware
					.authenticate(request, reply)
					.then(() => {
						done();
					})
					.catch(done);
			},
			handler: (request, reply) => {
				this.authController.me(request, reply);
			},
		});

		app.post("/auth/logout", {
			preHandler: (request, reply, done) => {
				void this.authMiddleware
					.authenticate(request, reply)
					.then(() => {
						done();
					})
					.catch(done);
			},
			handler: (request, reply) => {
				return this.authController.logout(request, reply);
			},
		});
	}
}
