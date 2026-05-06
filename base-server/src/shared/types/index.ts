import { FastifyRequest } from "fastify";

export * from "./IJWTPayload";
export * from "./IMiddleware";
export * from "./IRoute";
export * from "./IUserData";

export interface AuthenticatedUser {
	userId: string;
	email: string | null;
	name: string;
	referralCode: string;
	referredByCode: string | null;
}

export interface AuthenticatedRequest extends FastifyRequest {
	user: AuthenticatedUser;
}
