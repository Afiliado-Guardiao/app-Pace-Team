import cookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import Fastify, { FastifyInstance } from "fastify";

import { env } from "@/core/config/env";
import { Logger } from "@/core/config/logger";
import { Database } from "@/infrastructure/database/Database";
import { createErrorHandler } from "@/shared/http/errorHandler";
import { IRoute } from "@/shared/types";

import packageJson from "../../../package.json";

export class App {
	private app: FastifyInstance | null = null;

	constructor(
		private logger: Logger,
		private database: Database,
		private routes: IRoute[],
	) {}

	async setup(): Promise<FastifyInstance> {
		this.app = Fastify({
			logger: false,
			disableRequestLogging: true,
			trustProxy: true,
		});

		await this.registerPlugins();
		await this.registerRoutes();
		this.registerHealthCheck();

		return this.app;
	}

	private async registerPlugins(): Promise<void> {
		if (!this.app) throw new Error("App not initialized");

		await this.app.register(cookie, {
			secret: env.JWT_SECRET,
		});

		await this.app.register(jwt, {
			secret: env.JWT_SECRET,
		});

		// CSP desativado: API JSON pura para consumo mobile — CSP clássico não agrega
		// proteção neste contexto e pode interferir em futuros admin panels.
		await this.app.register(helmet, {
			contentSecurityPolicy: false,
			crossOriginResourcePolicy: { policy: "same-site" },
			referrerPolicy: { policy: "no-referrer" },
			hsts: { maxAge: 31536000, includeSubDomains: true, preload: false },
		});

		this.logger.info("Helmet registrado");

		await this.app.register(rateLimit, {
			max: env.RATE_LIMIT,
			timeWindow: env.RATE_LIMIT_TIMEWINDOW,
		});

		this.app.addHook("onResponse", async (request, reply) => {
			const method = request.method;
			const url = request.url;
			const statusCode = reply.statusCode;
			const responseTime = Math.round(reply.elapsedTime);

			const logMessage = `${method} ${url} → ${String(statusCode)} (${String(responseTime)}ms)`;

			this.logger.info(logMessage);
		});

		this.app.setErrorHandler(createErrorHandler(this.logger));

		this.logger.info("Plugins registrados");
	}

	private async registerRoutes(): Promise<void> {
		if (!this.app) throw new Error("App not initialized");

		for (const route of this.routes) {
			await route.register(this.app);
		}

		this.logger.info("Rotas registradas");
	}

	private formatUptime(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);

		const parts: string[] = [];
		if (hours > 0) parts.push(`${hours.toString()}h`);
		if (minutes > 0) parts.push(`${minutes.toString()}m`);
		if (secs > 0 || parts.length === 0) parts.push(`${secs.toString()}s`);

		return parts.join(" ");
	}

	private registerHealthCheck(): void {
		if (!this.app) throw new Error("App not initialized");

		this.app.get("/health", async (_request, reply) => {
			const dbHealthy = await this.database.healthCheck();
			const isHealthy = dbHealthy;

			const response = {
				status: isHealthy ? "saudável" : "não saudável",
				ambiente: env.NODE_ENV,
				servico: {
					nome: packageJson.name,
					versao: packageJson.version,
				},
				uptime: this.formatUptime(process.uptime()),
				servicos: {
					database: dbHealthy ? "conectado" : "desconectado",
				},
			};

			return reply.status(isHealthy ? 200 : 503).send(response);
		});

		this.logger.info("Endpoint de health registrado");
	}

	getInstance(): FastifyInstance {
		if (!this.app) {
			throw new Error("App not initialized. Call setup() first.");
		}
		return this.app;
	}
}
