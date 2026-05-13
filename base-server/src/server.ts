import { FastifyInstance } from "fastify";

import { env } from "@/core/config/env";
import { Logger } from "@/core/config/logger";
import { initializeI18n } from "@/core/i18n";
import { createAuthModule } from "@/domain/auth";
import { createOnboardingModule } from "@/domain/onboarding";
import { createReferralModule } from "@/domain/referral";
import { createSubscriptionModule } from "@/domain/subscription";
import { createUserModule } from "@/domain/user";
import { Database } from "@/infrastructure/database/Database";
import { App } from "@/infrastructure/http/app";

class Server {
	private logger: Logger;
	private database: Database;
	private application: App;
	private app: FastifyInstance | null = null;
	private startTime: number;
	private i18nInitialized = false;

	constructor() {
		this.logger = new Logger();
		this.database = new Database(this.logger);

		const authModule = createAuthModule(this.logger, this.database);
		const onboardingModule = createOnboardingModule(
			this.logger,
			this.database,
			authModule.middleware,
		);
		const userModule = createUserModule(this.logger, this.database, authModule.middleware);
		const referralModule = createReferralModule(this.logger, this.database, authModule.middleware);
		const subscriptionModule = createSubscriptionModule(this.logger, this.database);

		this.application = new App(this.logger, this.database, [
			authModule.routes,
			userModule.routes,
			onboardingModule.routes,
			referralModule.routes,
			subscriptionModule.routes,
		]);
		this.startTime = Date.now();
		this.setupProcessHandlers();
	}

	async initialize(): Promise<void> {
		try {
			this.logger.info("Iniciando servidor", {
				environment: env.NODE_ENV,
				nodeVersion: process.version,
			});

			if (!this.i18nInitialized) {
				this.logger.info("Inicializando i18n...");
				await initializeI18n();
				this.i18nInitialized = true;
				this.logger.info("i18n inicializado com sucesso");
			}

			await this.database.connect();
			this.app = await this.application.setup();

			await this.app.listen({
				port: env.PORT,
				host: "0.0.0.0",
			});

			const startupTime = Date.now() - this.startTime;
			this.logger.info("Servidor iniciado com sucesso", {
				url: `http://0.0.0.0:${String(env.PORT)}`,
				startupTime: `${String(startupTime)}ms`,
			});
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error("Falha ao inicializar servidor", err);
			process.exit(1);
		}
	}

	async stop(): Promise<void> {
		try {
			this.logger.info("Parando servidor...");

			if (this.app) {
				this.logger.info("Fechando servidor Fastify...");
				await this.app.close();
				this.logger.info("Servidor Fastify fechado");
			}

			await this.database.disconnect();

			this.logger.info("Servidor parado com sucesso");
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error("Erro ao parar servidor", err);
			process.exit(1);
		}
	}

	private setupProcessHandlers(): void {
		process.on("SIGTERM", () => {
			this.logger.info("Sinal SIGTERM recebido");
			void this.stop().then(() => process.exit(0));
		});

		process.on("SIGINT", () => {
			this.logger.info("Sinal SIGINT recebido");
			void this.stop().then(() => process.exit(0));
		});

		process.on("uncaughtException", (error) => {
			this.logger.error("Exceção não capturada", error);
			void this.stop().then(() => process.exit(1));
		});

		process.on("unhandledRejection", (reason) => {
			const err = reason instanceof Error ? reason : new Error(String(reason));
			this.logger.error("Rejeição não tratada", err);
			void this.stop().then(() => process.exit(1));
		});
	}
}

void (async (): Promise<void> => {
	const server = new Server();
	await server.initialize();
})();
