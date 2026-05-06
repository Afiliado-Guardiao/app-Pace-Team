import { FastifyInstance } from "fastify";

import { Logger } from "@/core/config/logger";
import { createAuthModule } from "@/domain/auth";
import { createOnboardingModule } from "@/domain/onboarding";
import { createReferralModule } from "@/domain/referral";
import { createUserModule } from "@/domain/user";
import { Database } from "@/infrastructure/database/Database";
import { App } from "@/infrastructure/http/app";

import { getDatabase } from "./database";

let app: FastifyInstance | null = null;
let database: Database | null = null;

export async function createTestServer(): Promise<FastifyInstance> {
	if (app) {
		return app;
	}

	// Create logger (silent in tests)
	const logger = new Logger();

	// Get database from test setup
	const prisma = getDatabase();
	database = new Database(logger);
	// @ts-expect-error - Setting prisma client for tests
	database.prisma = prisma;

	// Create modules
	const authModule = createAuthModule(logger, database);
	const onboardingModule = createOnboardingModule(logger, database, authModule.middleware);
	const userModule = createUserModule(logger, database, authModule.middleware);
	const referralModule = createReferralModule(logger, database, authModule.middleware);

	// Create app instance
	const application = new App(
		logger,
		database,
		[
			authModule.routes,
			userModule.routes,
			onboardingModule.routes,
			referralModule.routes,
		],
	);

	app = await application.setup();
	await app.ready();

	return app;
}

export async function closeTestServer(): Promise<void> {
	if (app) {
		await app.close();
		app = null;
	}
	database = null;
}

export function getTestServer(): FastifyInstance {
	if (!app) {
		throw new Error("Test server not initialized. Call createTestServer() first.");
	}
	return app;
}
