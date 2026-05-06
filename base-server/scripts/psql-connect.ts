import { execSync } from "child_process";
import * as dotenv from "dotenv";
import * as path from "path";

/* eslint-disable no-console */

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const env = process.env.NODE_ENV || "staging";

const dbNameMap: Record<string, string> = {
	staging: "pushtime_staging",
	production: "pushtime_prod",
};

const dbName = dbNameMap[env] || "pushtime_staging";

const containerNameMap: Record<string, string> = {
	staging: "pushtime-postgres-staging",
	production: "pushtime-postgres-prod",
};

const containerName = containerNameMap[env] || "pushtime-postgres-staging";

try {
	console.log(`Connecting to database ${dbName} in ${env} environment...`);

	execSync(`docker exec -it ${containerName} psql -U postgres -d ${dbName}`, {
		stdio: "inherit",
	});
} catch (error) {
	if (error instanceof Error) {
		console.error("Error connecting to database:", error.message);
	}
	process.exit(1);
}
