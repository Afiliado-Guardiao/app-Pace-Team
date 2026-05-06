import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

import { calculatePorts, setupDockerPorts } from "./docker-env";

/* eslint-disable no-console */

const args = process.argv.slice(2);
const options = {
	clean: args.includes("--clean"),
	dryRun: args.includes("--dry-run"),
	verbose: args.includes("--verbose") || args.includes("-v"),
	help: args.includes("--help") || args.includes("-h"),
};

const env = process.env.NODE_ENV || "staging";
const validEnvs = ["staging", "production"];
const PROJECT_NAME = "pushtime";
const CONTAINER_NAME = `${PROJECT_NAME}-api-${env === "production" ? "prod" : env}`;
const BACKUP_TAG = `${PROJECT_NAME}-api-${env}:pre-deploy-backup`;
const BACKUP_FILE = `/tmp/last-good-image-${env}.txt`;
const COMPOSE_FILE = `docker/${env}/docker-compose.yml`;
const HEALTH_CHECK_TIMEOUT = 30000;
const HEALTH_CHECK_INTERVAL = 3000;
const GRACEFUL_SHUTDOWN_TIMEOUT = 10;

if (!validEnvs.includes(env)) {
	console.error(`Invalid environment: ${env}. Must be one of: ${validEnvs.join(", ")}`);
	process.exit(1);
}

setupDockerPorts(env);

interface ContainerInfo {
	exists: boolean;
	running: boolean;
	imageHash?: string;
}

function executeCommand(command: string, ignoreError = false): string {
	if (options.dryRun) {
		if (options.verbose) {
			console.log(`[DRY-RUN] ${command}`);
		}
		return "";
	}

	if (options.verbose) {
		console.log(`[EXEC] ${command}`);
	}

	try {
		return execSync(command, { encoding: "utf8", stdio: options.verbose ? "inherit" : "pipe" });
	} catch (error) {
		if (!ignoreError && error instanceof Error) {
			console.error(`Error: ${error.message}`);
			throw error;
		}
		return "";
	}
}

function formatDuration(ms: number): string {
	if (ms < 1000) return `${ms.toString()}ms`;
	if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
	const mins = Math.floor(ms / 60000);
	const secs = Math.floor((ms % 60000) / 1000);
	return `${mins.toString()}m ${secs.toString()}s`;
}

function getTimestamp(): string {
	const parts = new Date().toISOString().split("T");
	if (!parts[1]) return "";
	const timePart = parts[1].split(".");
	return timePart[0] || "";
}

function log(emoji: string, message: string): void {
	console.log(`[${getTimestamp()}] ${emoji} ${message}`);
}

function validatePrerequisites(): void {
	log("🔍", "Validating prerequisites...");

	if (!fs.existsSync(COMPOSE_FILE)) {
		console.error(`Docker compose file not found: ${COMPOSE_FILE}`);
		process.exit(1);
	}

	const ports = calculatePorts(env);
	log(
		"✅",
		`Environment: ${env} | API Port: ${ports.apiPort.toString()} | DB Port: ${ports.postgresPort.toString()}`,
	);
}

function getContainerInfo(): ContainerInfo {
	log("🔍", `Checking container: ${CONTAINER_NAME}...`);

	const existsOutput = executeCommand(
		`docker ps -a --filter name=^${CONTAINER_NAME}$ --format "{{.Names}}"`,
		true,
	);
	const exists = existsOutput.trim() === CONTAINER_NAME;

	if (!exists) {
		log("ℹ️", "Container does not exist. First deploy.");
		return { exists: false, running: false };
	}

	const runningOutput = executeCommand(
		`docker ps --filter name=^${CONTAINER_NAME}$ --format "{{.Names}}"`,
		true,
	);
	const running = runningOutput.trim() === CONTAINER_NAME;

	const imageHash = executeCommand(
		`docker inspect ${CONTAINER_NAME} --format '{{.Image}}'`,
		true,
	).trim();

	const status = running ? "running" : "stopped";
	const imgShort = imageHash ? imageHash.substring(0, 12) : "N/A";
	log("✅", `Container found | Status: ${status} | Image: ${imgShort}`);

	return { exists, running, imageHash };
}

function saveCurrentImage(containerInfo: ContainerInfo): boolean {
	if (!containerInfo.exists || !containerInfo.imageHash) {
		log("ℹ️", "No image to backup (first deploy)");
		return false;
	}

	log("💾", "Saving current image for backup...");

	try {
		executeCommand(`docker tag ${containerInfo.imageHash} ${BACKUP_TAG}`);

		if (!options.dryRun) {
			fs.writeFileSync(BACKUP_FILE, containerInfo.imageHash);
		}

		log("✅", `Backup image created: ${BACKUP_TAG}`);
		return true;
	} catch (error) {
		console.error("Failed to create image backup");
		if (options.verbose && error instanceof Error) {
			console.error(error.message);
		}
		return false;
	}
}

function buildImage(): boolean {
	const buildStart = Date.now();
	const cacheFlag = options.clean ? "--no-cache" : "";
	const buildMode = options.clean ? "(no cache - slower)" : "(with cache)";

	log("🔨", `Starting build ${buildMode}...`);

	try {
		const buildCommand = `docker compose -f ${COMPOSE_FILE} build ${cacheFlag} api`;
		executeCommand(buildCommand);

		const duration = Date.now() - buildStart;
		log("✅", `Build completed in ${formatDuration(duration)}`);
		return true;
	} catch (error) {
		console.error("Build failed");
		if (options.verbose && error instanceof Error) {
			console.error(error.message);
		}
		return false;
	}
}

function deployContainer(): boolean {
	log("🔄", "Starting container deployment...");

	try {
		log("⏸️", `Stopping container (timeout: ${GRACEFUL_SHUTDOWN_TIMEOUT.toString()}s)...`);
		executeCommand(
			`docker compose -f ${COMPOSE_FILE} stop -t ${GRACEFUL_SHUTDOWN_TIMEOUT.toString()} api`,
			true,
		);

		log("🗑️", "Removing old container...");
		executeCommand(`docker compose -f ${COMPOSE_FILE} rm -f api`, true);

		log("🚀", "Starting new container...");
		executeCommand(`docker compose -f ${COMPOSE_FILE} up -d api`);

		log("✅", "Container started");
		return true;
	} catch (error) {
		console.error("Container deployment failed");
		if (options.verbose && error instanceof Error) {
			console.error(error.message);
		}
		return false;
	}
}

async function healthCheck(): Promise<boolean> {
	log("🏥", `Checking container health (timeout: ${(HEALTH_CHECK_TIMEOUT / 1000).toString()}s)...`);

	const startTime = Date.now();
	const ports = calculatePorts(env);
	const healthUrl = `http://localhost:${ports.apiPort.toString()}/health`;

	log("⏳", "Waiting for initial boot (3s)...");
	await new Promise((resolve) => setTimeout(resolve, 3000));

	let attempt = 0;
	const maxAttempts = Math.floor(HEALTH_CHECK_TIMEOUT / HEALTH_CHECK_INTERVAL);

	while (Date.now() - startTime < HEALTH_CHECK_TIMEOUT) {
		attempt++;
		log("🔍", `Health check ${attempt.toString()}/${maxAttempts.toString()}...`);

		const statusOutput = executeCommand(
			`docker ps --filter name=^${CONTAINER_NAME}$ --format "{{.Status}}"`,
			true,
		);

		if (!statusOutput.includes("Up")) {
			console.error("Container is not running");
			console.log("\nLast container logs:");
			executeCommand(`docker logs ${CONTAINER_NAME} --tail 30`, true);
			return false;
		}

		try {
			const curlCommand = `curl -sf -o /dev/null -w "%{http_code}" ${healthUrl} 2>/dev/null || echo "000"`;
			const httpCode = executeCommand(curlCommand, true).trim();

			if (httpCode === "200") {
				const duration = Date.now() - startTime;
				log("✅", `Health check passed! Container healthy (${formatDuration(duration)})`);
				return true;
			}

			if (options.verbose) {
				log("⚠️", `Endpoint /health returned: ${httpCode}`);
			}
		} catch {
			if (options.verbose) {
				log("⚠️", "Endpoint /health not accessible yet");
			}
		}

		const logs = executeCommand(`docker logs ${CONTAINER_NAME} --tail 20 2>&1`, true);
		if (logs.includes("FATAL") || logs.includes("Cannot")) {
			console.error("Fatal errors detected in logs");
			console.log("\nError logs:");
			console.log(logs);
			return false;
		}

		if (Date.now() - startTime < HEALTH_CHECK_TIMEOUT) {
			await new Promise((resolve) => setTimeout(resolve, HEALTH_CHECK_INTERVAL));
		}
	}

	console.error(
		`Timeout: Container did not become healthy in ${(HEALTH_CHECK_TIMEOUT / 1000).toString()}s`,
	);
	console.log("\nLast container logs:");
	executeCommand(`docker logs ${CONTAINER_NAME} --tail 30`, true);
	return false;
}

async function rollback(): Promise<boolean> {
	log("⚠️", "Deploy failed. Starting rollback...");

	try {
		const hasBackup = executeCommand(`docker images -q ${BACKUP_TAG}`, true).trim() !== "";

		if (!hasBackup) {
			console.error("No backup image available. Run: npm run docker:up");
			return false;
		}

		log("🛑", "Removing failed container...");
		executeCommand(`docker compose -f ${COMPOSE_FILE} stop -t 5 api`, true);
		executeCommand(`docker compose -f ${COMPOSE_FILE} rm -f api`, true);

		const ports = calculatePorts(env);
		const networkName = `${PROJECT_NAME}-${env}-network`;
		const envFile = path.resolve(__dirname, "../.env");

		log("🔄", "Restoring previous container...");

		const dockerRunCommand = `docker run -d \
			--name ${CONTAINER_NAME} \
			--network ${networkName} \
			--restart unless-stopped \
			-p ${ports.apiPort.toString()}:${ports.apiPort.toString()} \
			--env-file ${envFile} \
			-e NODE_ENV=${env} \
			-e PORT=${ports.apiPort.toString()} \
			-e DATABASE_URL=postgresql://postgres:postgres@postgres:5432/pushtime_${env === "production" ? "prod" : env} \
			${BACKUP_TAG} \
			${env === "production" ? "node dist/server.js" : "npm run dev"}`;

		executeCommand(dockerRunCommand);

		log("⏳", "Waiting for restored container to initialize...");
		await new Promise((resolve) => setTimeout(resolve, 5000));

		const statusOutput = executeCommand(
			`docker ps --filter name=^${CONTAINER_NAME}$ --format "{{.Status}}"`,
			true,
		);

		if (statusOutput.includes("Up")) {
			log("✅", "Rollback successful. Service restored to previous version.");
			return true;
		}

		console.error("Rollback failed. Container is not running.");
		return false;
	} catch (error) {
		console.error("Critical error during rollback");
		if (options.verbose && error instanceof Error) {
			console.error(error.message);
		}
		console.log("\nManual action required:");
		console.log("   npm run docker:up");
		return false;
	}
}

function cleanupOldImages(): void {
	log("🧹", "Cleaning up old images...");

	try {
		const hasBackup = executeCommand(`docker images -q ${BACKUP_TAG}`, true).trim() !== "";
		if (hasBackup) {
			executeCommand(`docker rmi ${BACKUP_TAG}`, true);
			log("✅", "Backup image removed");
		}

		const danglingImages = executeCommand(
			`docker images -f "dangling=true" -f "label=com.${PROJECT_NAME}.project=${PROJECT_NAME}" -q`,
			true,
		)
			.trim()
			.split("\n")
			.filter(Boolean);

		if (danglingImages.length > 0) {
			danglingImages.forEach((imageId) => {
				executeCommand(`docker rmi ${imageId}`, true);
			});
			log("✅", `${danglingImages.length.toString()} old image(s) removed`);
		}

		if (fs.existsSync(BACKUP_FILE) && !options.dryRun) {
			fs.unlinkSync(BACKUP_FILE);
		}
	} catch (error) {
		if (options.verbose) {
			console.error("Warning: Partial failure in image cleanup");
			if (error instanceof Error) {
				console.error(error.message);
			}
		}
	}
}

async function main(): Promise<void> {
	const deployStartTime = Date.now();

	console.log("\n" + "=".repeat(60));
	log("🚀", `DEPLOY - ${PROJECT_NAME.toUpperCase()}`);
	console.log("=".repeat(60));
	log("📋", `Environment: ${env}`);
	log("📋", `Container: ${CONTAINER_NAME}`);
	log("📋", `Compose: ${COMPOSE_FILE}`);
	if (options.dryRun) log("⚠️", "DRY-RUN MODE - No changes will be made");
	if (options.clean) log("⚠️", "Clean build (--no-cache) - May take longer");
	console.log("=".repeat(60) + "\n");

	validatePrerequisites();

	const containerInfo = getContainerInfo();

	const hasBackup = saveCurrentImage(containerInfo);

	if (!buildImage()) {
		console.error("Deploy aborted: Build failed");
		process.exit(1);
	}

	if (!deployContainer()) {
		console.error("Deploy aborted: Container deployment failed");
		if (hasBackup) {
			await rollback();
		}
		process.exit(1);
	}

	const isHealthy = await healthCheck();

	if (!isHealthy) {
		console.error("Deploy failed: Container did not pass health check");
		if (hasBackup) {
			await rollback();
		}
		process.exit(1);
	}

	cleanupOldImages();

	const totalDuration = Date.now() - deployStartTime;
	const ports = calculatePorts(env);

	console.log("\n" + "=".repeat(60));
	log("✅", "DEPLOY COMPLETED SUCCESSFULLY!");
	console.log("=".repeat(60));
	log("⏱️", `Total time: ${formatDuration(totalDuration)}`);
	log("🌐", `API URL: http://localhost:${ports.apiPort.toString()}`);
	log("🏥", `Health check: http://localhost:${ports.apiPort.toString()}/health`);
	log("📊", `Logs: docker logs ${CONTAINER_NAME} -f`);
	console.log("=".repeat(60) + "\n");
}

if (require.main === module) {
	if (options.help) {
		console.log(`
Usage: npm run docker:deploy [options]

Options:
  --clean     Build without cache (slower, but ensures clean image)
  --dry-run   Simulate deploy without executing (for testing)
  --verbose   Show detailed logs of each command
  --help      Show this message

Examples:
  NODE_ENV=staging npm run docker:deploy
  NODE_ENV=production npm run docker:deploy
  NODE_ENV=staging npm run docker:deploy --clean
		`);
		process.exit(0);
	}

	main().catch((error: unknown) => {
		console.error("Fatal error during deploy");
		if (error instanceof Error) {
			console.error(error.message);
		}
		process.exit(1);
	});
}

export {
	buildImage,
	cleanupOldImages,
	deployContainer,
	getContainerInfo,
	healthCheck,
	rollback,
	saveCurrentImage,
};
