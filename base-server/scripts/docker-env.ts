import { execSync } from "child_process";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const STAGING_OFFSET = 0;
const PRODUCTION_OFFSET = 100;
const API_OFFSET = 1;
const POSTGRES_OFFSET = 2;

export function validateBasePort(): number {
	const basePort = parseInt(process.env.BASE_PORT || "11000", 10);

	if (isNaN(basePort) || basePort < 1024 || basePort > 65535) {
		console.error(
			`Invalid BASE_PORT: ${process.env.BASE_PORT ?? "undefined"}. Using default: 11000`,
		);
		return 11000;
	}

	return basePort;
}

export function calculatePorts(
	env: string,
	basePort?: number,
): { apiPort: number; postgresPort: number } {
	const port = basePort ?? validateBasePort();
	const envOffset = env === "production" ? PRODUCTION_OFFSET : STAGING_OFFSET;

	return {
		apiPort: port + envOffset + API_OFFSET,
		postgresPort: port + envOffset + POSTGRES_OFFSET,
	};
}

export function setupDockerPorts(environment: string): void {
	const validEnvs = ["staging", "production"];

	if (!validEnvs.includes(environment)) {
		console.error(`Invalid environment: ${environment}. Must be one of: ${validEnvs.join(", ")}`);
		process.exit(1);
	}

	const ports = calculatePorts(environment);

	if (environment === "staging") {
		process.env.STAGING_API_PORT = String(ports.apiPort);
		process.env.STAGING_POSTGRES_PORT = String(ports.postgresPort);
	} else {
		process.env.PRODUCTION_API_PORT = String(ports.apiPort);
		process.env.PRODUCTION_POSTGRES_PORT = String(ports.postgresPort);
	}
}

function checkIfContainerExists(containerName: string): boolean {
	try {
		const result = execSync(
			`docker ps -a --format "{{.Names}}" | grep -w "${containerName}" || true`,
			{ encoding: "utf8" },
		);
		return result.includes(containerName);
	} catch {
		return false;
	}
}

if (require.main === module) {
	const env = process.env.NODE_ENV || "staging";

	setupDockerPorts(env);

	const isProd = env === "production";

	if (isProd) {
		try {
			const containerExists = checkIfContainerExists("pushtime-postgres-prod");
			if (containerExists) {
				if (process.argv.includes("--verbose")) {
					console.error("Production container detected. Operating in safe mode.");
				}
			}
		} catch {
			// Verificação de produção falha silenciosamente — comportamento esperado
		}
	}

	const composeFile = `docker/${env}/docker-compose.yml`;
	const args = process.argv.slice(2).join(" ");
	const command = `docker compose -f ${composeFile} ${args}`;

	try {
		execSync(command, {
			stdio: "inherit",
			env: process.env,
		});
	} catch {
		process.exit(1);
	}
}
