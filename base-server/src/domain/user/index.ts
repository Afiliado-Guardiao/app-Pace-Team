import { Logger } from "@/core/config/logger";
import { Database } from "@/infrastructure/database/Database";
import { IMiddleware } from "@/shared/types";

import { UserController } from "./controllers/UserController";
import { UserRepository } from "./repositories/UserRepository";
import { UserRoutes } from "./routes/user.routes";
import { UserService } from "./services/UserService";

export function createUserModule(
	logger: Logger,
	database: Database,
	authMiddleware: IMiddleware,
): { routes: UserRoutes } {
	const repository = new UserRepository(database, logger);
	const service = new UserService(logger, repository);
	const controller = new UserController(service);
	const routes = new UserRoutes(controller, authMiddleware);

	return { routes };
}
