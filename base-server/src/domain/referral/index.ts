import { Logger } from "@/core/config/logger";
import { Database } from "@/infrastructure/database/Database";
import { IMiddleware } from "@/shared/types";

import { ReferralController } from "./controllers/ReferralController";
import { ReferralRepository } from "./repositories/ReferralRepository";
import { ReferralRoutes } from "./routes/referral.routes";
import { ReferralService } from "./services/ReferralService";

export function createReferralModule(
	logger: Logger,
	database: Database,
	authMiddleware: IMiddleware,
): { routes: ReferralRoutes } {
	const repository = new ReferralRepository(database, logger);
	const service = new ReferralService(logger, repository);
	const controller = new ReferralController(service);
	const routes = new ReferralRoutes(controller, authMiddleware);

	return { routes };
}
