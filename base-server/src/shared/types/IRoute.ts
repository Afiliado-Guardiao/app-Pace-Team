import { FastifyInstance } from "fastify";

export interface IRoute {
	register(app: FastifyInstance): Promise<void> | void;
}
