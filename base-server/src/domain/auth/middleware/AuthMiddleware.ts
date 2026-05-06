import { FastifyReply, FastifyRequest } from "fastify";

import { Logger } from "@/core/config/logger";
import { UnauthorizedError } from "@/shared/errors";
import { AuthenticatedUser } from "@/shared/types";

import { IAuthRepository, IAuthService } from "../types";

export class AuthMiddleware {
	constructor(
		private logger: Logger,
		private authService: IAuthService,
		private authRepository: IAuthRepository,
	) {}

	async authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		try {
			const authHeader = request.headers.authorization;

			if (!authHeader) {
				throw new UnauthorizedError("No authorization header provided");
			}

			const [type, token] = authHeader.split(" ");

			if (type !== "Bearer" || !token) {
				throw new UnauthorizedError("Invalid authorization header format");
			}

			const payload = this.authService.verifyToken(token);

			const isValidVersion = await this.authRepository.validateLoginVersion(
				payload.userId,
				payload.loginVersion,
			);

			if (!isValidVersion) {
				this.logger.warn("Login version mismatch - session invalidated", {
					userId: payload.userId,
					tokenVersion: payload.loginVersion,
				});
				throw new UnauthorizedError("Session has been invalidated. Please login again.");
			}

			(request as FastifyRequest & { user?: AuthenticatedUser }).user = {
				userId: payload.userId,
				email: payload.email,
				name: payload.name,
				referralCode: payload.referralCode,
				referredByCode: payload.referredByCode ?? null,
			};
		} catch (error) {
			this.logger.warn("Authentication failed", { error });

			if (error instanceof UnauthorizedError) {
				void reply.status(error.statusCode).send({
					error: error.code,
					message: error.message,
				});
				return;
			}

			void reply.status(401).send({
				error: "UNAUTHORIZED",
				message: "Authentication failed",
			});
		}
	}
}
