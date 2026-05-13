import { env } from "@/core/config/env";
import { Logger } from "@/core/config/logger";
import { Database } from "@/infrastructure/database/Database";

import { WebhookController } from "./controllers/WebhookController";
import { SubscriptionRepository } from "./repositories/SubscriptionRepository";
import { SubscriptionRoutes } from "./routes/subscription.routes";
import { SubscriptionService } from "./services/SubscriptionService";
import { WebhookProcessor } from "./services/WebhookProcessor";
import { WebhookVerifier } from "./services/WebhookVerifier";
import { ISubscriptionService } from "./types";

export function createSubscriptionService(
	logger: Logger,
	database: Database,
): ISubscriptionService {
	const repository = new SubscriptionRepository(database, logger);
	return new SubscriptionService(logger, repository);
}

export function createSubscriptionModule(
	logger: Logger,
	database: Database,
): { routes: SubscriptionRoutes; service: ISubscriptionService } {
	const repository = new SubscriptionRepository(database, logger);
	const service = new SubscriptionService(logger, repository);

	const verifier = new WebhookVerifier(logger, {
		pathSecret: env.PAYWALLO_WEBHOOK_PATH_SECRET,
		hmacSecret: env.PAYWALLO_WEBHOOK_HMAC_SECRET,
	});
	const processor = new WebhookProcessor(logger, repository);
	const controller = new WebhookController(logger, verifier, processor);
	const routes = new SubscriptionRoutes(controller);

	return { routes, service };
}
