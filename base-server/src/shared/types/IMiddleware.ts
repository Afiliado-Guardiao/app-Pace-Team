import { FastifyReply, FastifyRequest } from "fastify";

export interface IMiddleware {
	authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
