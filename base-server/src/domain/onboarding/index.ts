import { Logger } from "@/core/config/logger";
import { Database } from "@/infrastructure/database/Database";
import { IMiddleware } from "@/shared/types";

import { OnboardingController } from "./controllers/OnboardingController";
import { OnboardingRepository } from "./repositories/OnboardingRepository";
import { OnboardingRoutes } from "./routes/onboarding.routes";
import { OnboardingService } from "./services/OnboardingService";
import { IOnboardingService } from "./types";

export function createOnboardingService(logger: Logger, database: Database): IOnboardingService {
	const repository = new OnboardingRepository(database, logger);
	return new OnboardingService(logger, repository);
}

export function createOnboardingModule(
	logger: Logger,
	database: Database,
	authMiddleware: IMiddleware,
): { routes: OnboardingRoutes; service: IOnboardingService } {
	const service = createOnboardingService(logger, database);
	const controller = new OnboardingController(service);
	const routes = new OnboardingRoutes(controller, authMiddleware);

	return { routes, service };
}
