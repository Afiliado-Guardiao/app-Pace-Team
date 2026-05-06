import { PrismaClient } from "@prisma/client";

import { Logger } from "@/core/config/logger";

export class Database {
	private prisma: PrismaClient;
	private isConnected = false;

	constructor(private logger: Logger) {
		this.prisma = new PrismaClient({
			log: [
				{ level: "error", emit: "event" as const },
				{ level: "warn", emit: "event" as const },
			],
		});

		this.setupLogging();
	}

	private setupLogging(): void {
		// Tipagem do Prisma.$on é incompleta para eventos "error"/"warn" mesmo quando configurados via log option — cast necessário aqui.
		(this.prisma as unknown as { $on(event: string, cb: (e: { message: string }) => void): void }).$on(
			"error",
			(e) => {
				this.logger.error("Erro no banco de dados: " + e.message);
			},
		);

		(this.prisma as unknown as { $on(event: string, cb: (e: { message: string }) => void): void }).$on(
			"warn",
			(e) => {
				this.logger.warn("Aviso do banco de dados: " + e.message);
			},
		);
	}

	async connect(): Promise<void> {
		if (this.isConnected) {
			return;
		}

		try {
			await this.prisma.$connect();
			this.isConnected = true;
			this.logger.info("Banco de dados conectado");
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error("Falha ao conectar no banco de dados", err);
			throw error;
		}
	}

	async disconnect(): Promise<void> {
		if (!this.isConnected) {
			return;
		}

		try {
			await this.prisma.$disconnect();
			this.isConnected = false;
			this.logger.info("Banco de dados desconectado");
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error("Falha ao desconectar do banco de dados", err);
			throw error;
		}
	}

	getClient(): PrismaClient {
		return this.prisma;
	}

	async healthCheck(): Promise<boolean> {
		try {
			await this.prisma.$queryRaw`SELECT 1`;
			return true;
		} catch {
			return false;
		}
	}
}
