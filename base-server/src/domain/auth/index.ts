import { Logger } from "@/core/config/logger";
import { Database } from "@/infrastructure/database/Database";

import { AuthController } from "./controllers/AuthController";
import { AuthMiddleware } from "./middleware/AuthMiddleware";
import { AuthRepository } from "./repositories/AuthRepository";
import { AuthRoutes } from "./routes/auth.routes";
import { AuthService } from "./services/AuthService";

export function createAuthModule(
	logger: Logger,
	database: Database,
): { routes: AuthRoutes; middleware: AuthMiddleware; service: AuthService } {
	const repository = new AuthRepository(database, logger);
	const service = new AuthService(logger, repository);
	const controller = new AuthController(service);
	const middleware = new AuthMiddleware(logger, service, repository);
	const routes = new AuthRoutes(controller, middleware);

	return { routes, middleware, service };
}
