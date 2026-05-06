import { execSync } from "child_process";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

import { setupDockerPorts } from "./docker-env";

/* eslint-disable no-console */

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const args = process.argv.slice(2);
const options = {
	skipBackup: args.includes("--skip-backup"),
	help: args.includes("--help") || args.includes("-h"),
	shutdown: args.includes("--shutdown"),
	dryRun: args.includes("--dry-run"),
	verbose: args.includes("--verbose") || args.includes("-v"),
};

const env = process.env.NODE_ENV || "staging";
const validEnvs = ["staging", "production"];
const PROJECT_NAME = "pushtime";
const PROJECT_LABEL = `com.${PROJECT_NAME}.project=${PROJECT_NAME}`;
const ENV_LABEL = `com.${PROJECT_NAME}.environment=${env}`;
const MAX_BACKUPS = 3;

if (!validEnvs.includes(env)) {
	console.error(`Invalid environment: ${env}. Must be one of: ${validEnvs.join(", ")}`);
	process.exit(1);
}

setupDockerPorts(env);

type ResourceCount = {
	containers: number;
	images: number;
	volumes: number;
	networks: number;
};

type CleanupResult = {
	itemsRemoved: {
		containers: number;
		images: number;
		volumes: number;
		networks: number;
		logs: number;
		backups: number;
	};
};

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
		return execSync(command, { encoding: "utf8" });
	} catch (error) {
		if (!ignoreError && error instanceof Error) {
			console.error(`Error: ${error.message}`);
		}
		return "";
	}
}

function ensureDirectoryExists(dirPath: string): void {
	if (!fs.existsSync(dirPath) && !options.dryRun) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
}

function getProjectFilter(): string {
	return `-f label=${PROJECT_LABEL} -f label=${ENV_LABEL}`;
}

/**
 * Verifica se um recurso órfão (sem labels) pertence ao nosso projeto.
 * Usa critérios ULTRA-CONSERVADORES para evitar falsos positivos.
 */
function isOurOrphan(name: string, currentEnv: string): boolean {
	if (!name) return false;

	const hasProjectName = name.includes("pushtime");
	if (!hasProjectName) return false;

	const envMatch =
		currentEnv === "production"
			? name.includes("production") || name.includes("-prod") || name.includes("_prod")
			: name.includes("staging");
	if (!envMatch) return false;

	const blacklist = ["ozempro", "other"];
	if (blacklist.some((b) => name.toLowerCase().includes(b))) return false;

	return true;
}

function listContainers(): string[] {
	const output = executeCommand(`docker ps -a ${getProjectFilter()} -q`, true);
	return output.trim().split("\n").filter(Boolean);
}

function listImages(): string[] {
	const output = executeCommand(`docker images -f label=${PROJECT_LABEL} -q`, true);
	return output.trim().split("\n").filter(Boolean);
}

function listVolumes(): string[] {
	const output = executeCommand(`docker volume ls ${getProjectFilter()} -q`, true);
	return output.trim().split("\n").filter(Boolean);
}

function listNetworks(): string[] {
	const output = executeCommand(`docker network ls ${getProjectFilter()} -q`, true);
	return output.trim().split("\n").filter(Boolean);
}

function listDanglingImages(): string[] {
	const output = executeCommand('docker images -f "dangling=true" -q', true);
	return output.trim().split("\n").filter(Boolean);
}

function countCurrentResources(): ResourceCount {
	const containers = listContainers().length;
	const images = listImages().length;
	const volumes = listVolumes().length;
	const networks = listNetworks().length;

	return { containers, images, volumes, networks };
}

function listOrphanContainers(): string[] {
	const allContainers = executeCommand('docker ps -a --format "{{.ID}}|{{.Names}}"', true);

	const labeled = listContainers();
	const orphans: string[] = [];

	allContainers
		.trim()
		.split("\n")
		.filter(Boolean)
		.forEach((line) => {
			const parts = line.split("|");
			const id = parts[0];
			const name = parts[1];
			if (id && name && !labeled.includes(id) && isOurOrphan(name, env)) {
				orphans.push(id);
			}
		});

	return orphans;
}

function listOrphanVolumes(): string[] {
	const allVolumes = executeCommand('docker volume ls --format "{{.Name}}"', true);

	const labeled = listVolumes();
	const orphans: string[] = [];

	allVolumes
		.trim()
		.split("\n")
		.filter(Boolean)
		.forEach((name) => {
			if (!labeled.includes(name) && isOurOrphan(name, env)) {
				orphans.push(name);
			}
		});

	return orphans;
}

function listOrphanNetworks(): string[] {
	const allNetworks = executeCommand('docker network ls --format "{{.ID}}|{{.Name}}"', true);

	const labeled = listNetworks();
	const orphans: string[] = [];

	allNetworks
		.trim()
		.split("\n")
		.filter(Boolean)
		.forEach((line) => {
			const parts = line.split("|");
			const id = parts[0];
			const name = parts[1];
			const defaultNetworks = ["bridge", "host", "none"];
			if (
				id &&
				name &&
				!defaultNetworks.includes(name) &&
				!labeled.includes(id) &&
				isOurOrphan(name, env)
			) {
				orphans.push(id);
			}
		});

	return orphans;
}

function removeResource(type: "container" | "image" | "volume" | "network", id: string): boolean {
	let command = "";

	switch (type) {
		case "container":
			command = `docker rm -f "${id}"`;
			break;
		case "image":
			command = `docker rmi "${id}"`;
			break;
		case "volume":
			command = `docker volume rm "${id}"`;
			break;
		case "network":
			command = `docker network rm "${id}"`;
			break;
	}

	const result = executeCommand(command, true);
	return result.trim() !== "";
}

function getContainerName(containerId: string): string {
	return executeCommand(`docker ps -a --format "{{.Names}}" -f id=${containerId}`, true).trim();
}

function removeContainersWithFilter(
	includeOrphans: boolean,
	filter: (name: string) => boolean = () => true,
): number {
	const labeled = listContainers();
	const orphans = includeOrphans ? listOrphanContainers() : [];
	const allContainers = [...labeled, ...orphans];

	let removed = 0;
	allContainers.forEach((id) => {
		const name = getContainerName(id);
		if (filter(name)) {
			if (removeResource("container", id)) {
				removed++;
			}
		}
	});

	return removed;
}

function removeVolumesWithFilter(includeOrphans: boolean): number {
	const labeled = listVolumes();
	const orphans = includeOrphans ? listOrphanVolumes() : [];
	const allVolumes = [...labeled, ...orphans];

	let removed = 0;
	allVolumes.forEach((name) => {
		if (removeResource("volume", name)) {
			removed++;
		}
	});

	return removed;
}

function removeImagesWithStrategy(keepLatest: boolean): number {
	const images = listImages();
	const toRemove = keepLatest && images.length > 1 ? images.slice(0, -1) : images;

	let removed = 0;
	toRemove.forEach((id) => {
		if (removeResource("image", id)) {
			removed++;
		}
	});

	return removed;
}

function removeNetworksWithFilter(includeOrphans: boolean): number {
	const labeled = listNetworks();
	const orphans = includeOrphans ? listOrphanNetworks() : [];
	const allNetworks = [...labeled, ...orphans];

	return removeUnusedNetworks(allNetworks);
}

function cleanBuilderCache(removeAll: boolean): void {
	if (removeAll) {
		executeCommand("docker builder prune -af", true);
	} else {
		executeCommand('docker builder prune -f --filter "until=48h"', true);
	}
}

function removeDanglingImages(): number {
	const dangling = listDanglingImages();

	let removed = 0;
	dangling.forEach((id) => {
		if (removeResource("image", id)) {
			removed++;
		}
	});

	if (removed > 0 && options.verbose) {
		console.log(`Removed ${String(removed)} dangling image(s)`);
	}

	return removed;
}

function removeUnusedNetworks(networkIds: string[]): number {
	let removed = 0;

	networkIds.forEach((id) => {
		const inspect = executeCommand(
			`docker network inspect ${id} --format "{{.Containers}}" 2>/dev/null || echo "error"`,
			true,
		);

		if (inspect.trim() === "{}" || inspect.trim() === "" || inspect.includes("error")) {
			if (removeResource("network", id)) {
				removed++;
			}
		}
	});

	return removed;
}

function cleanupLogs(): number {
	const logsDir = path.resolve(__dirname, "../logs");

	if (fs.existsSync(logsDir)) {
		try {
			if (!options.dryRun) {
				fs.rmSync(logsDir, { recursive: true, force: true });
				fs.mkdirSync(logsDir, { recursive: true });
			}
			console.log("Logs directory cleaned");
			return 1;
		} catch (error) {
			console.error("Error cleaning logs:", error);
		}
	}

	return 0;
}

function cleanupBackups(backupDir: string, prefix: string, maxBackups: number): number {
	if (!fs.existsSync(backupDir)) return 0;

	const files = fs
		.readdirSync(backupDir)
		.filter((file) => file.startsWith(prefix) && file.endsWith(".sql"))
		.sort()
		.map((file) => ({ name: file, path: path.join(backupDir, file) }));

	const excessBackups = files.length - maxBackups;
	if (excessBackups <= 0) return 0;

	let removed = 0;
	for (let i = 0; i < excessBackups; i++) {
		const file = files[i];
		if (!file) continue;

		try {
			if (!options.dryRun) {
				fs.unlinkSync(file.path);
			}
			console.log(`Excess backup removed: ${file.name}`);
			removed++;
		} catch (error) {
			console.error(`Error removing backup ${file.name}:`, error);
		}
	}

	return removed;
}

function backupDatabase(): string {
	if (env !== "production") {
		console.log("Backup skipped: not production");
		return "";
	}

	const containerName = "pushtime-postgres-prod";
	const dbName = "pushtime_prod";

	const isRunning = executeCommand(
		`docker ps ${getProjectFilter()} --format "{{.Names}}"`,
		true,
	).includes(containerName);

	if (!isRunning) {
		console.error("❌ Backup failed: postgres container not running");
		console.error("   Start containers first with: npm run docker:up");
		return "";
	}

	const backupDir = path.resolve(__dirname, "../backups");
	ensureDirectoryExists(backupDir);

	const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
	const backupFileName = `${dbName}_${timestamp}.sql`;
	const backupPath = path.resolve(backupDir, backupFileName);

	console.log(`Backing up database ${dbName}...`);
	executeCommand(`docker exec ${containerName} pg_dump -U postgres ${dbName} > ${backupPath}`);

	if (fs.existsSync(backupPath) && fs.statSync(backupPath).size > 0) {
		console.log(`✅ Backup saved: ${backupPath}`);
		cleanupBackups(backupDir, dbName, MAX_BACKUPS);
		return backupPath;
	}

	console.error("❌ Backup failed: file not created or empty");
	return "";
}

function shutdownDockerServices(): void {
	console.log("\n🛑 Shutting down Docker services...");

	const projectDir = path.resolve(__dirname, `../docker/${env}`);
	const composeFile = path.join(projectDir, "docker-compose.yml");

	if (!fs.existsSync(composeFile)) {
		console.log("No docker-compose.yml found");
		return;
	}

	if (env === "production") {
		console.log("Stopping API only (preserving database)...");
		executeCommand(`cd ${projectDir} && docker compose stop api && docker compose rm -f api`);
	} else {
		console.log("Stopping all services...");
		executeCommand(`cd ${projectDir} && docker compose down`);
	}
}

function cleanupStaging(initialCount: ResourceCount): CleanupResult {
	console.log("🔧 STAGING: Aggressive cleanup (including orphans)\n");

	const itemsRemoved = {
		containers: 0,
		images: 0,
		volumes: 0,
		networks: 0,
		logs: 0,
		backups: 0,
	};

	itemsRemoved.logs = cleanupLogs();

	console.log("Removing containers (labeled + orphans)...");
	removeContainersWithFilter(true);

	console.log("Removing volumes (labeled + orphans)...");
	removeVolumesWithFilter(true);

	console.log("Removing images...");
	removeImagesWithStrategy(false);
	removeDanglingImages();

	console.log("Removing networks...");
	removeNetworksWithFilter(true);

	console.log("Cleaning builder cache...");
	cleanBuilderCache(true);

	const resourcesAfter = countCurrentResources();

	const actualRemoved = {
		containers: Math.max(0, initialCount.containers - resourcesAfter.containers),
		images: Math.max(0, initialCount.images - resourcesAfter.images),
		volumes: Math.max(0, initialCount.volumes - resourcesAfter.volumes),
		networks: Math.max(0, initialCount.networks - resourcesAfter.networks),
		logs: itemsRemoved.logs,
		backups: itemsRemoved.backups,
	};

	return { itemsRemoved: actualRemoved };
}

function cleanupProduction(initialCount: ResourceCount): CleanupResult {
	console.log("🔒 PRODUCTION: Conservative cleanup (preserving database)\n");

	const itemsRemoved = {
		containers: 0,
		images: 0,
		volumes: 0,
		networks: 0,
		logs: 0,
		backups: 0,
	};

	if (!options.skipBackup) {
		console.log("Creating backup...");
		backupDatabase();
	}

	itemsRemoved.logs = cleanupLogs();

	console.log("Removing API containers (preserving postgres)...");
	removeContainersWithFilter(true, (name) => !name.includes("postgres"));

	console.log("Removing old images (keeping latest)...");
	removeImagesWithStrategy(true);
	removeDanglingImages();

	console.log("Preserving all volumes (database data)");

	console.log("Removing unused networks...");
	removeNetworksWithFilter(false);

	console.log("Cleaning old builder cache (48h+)...");
	cleanBuilderCache(false);

	const resourcesAfter = countCurrentResources();

	const actualRemoved = {
		containers: Math.max(0, initialCount.containers - resourcesAfter.containers),
		images: Math.max(0, initialCount.images - resourcesAfter.images),
		volumes: Math.max(0, initialCount.volumes - resourcesAfter.volumes),
		networks: Math.max(0, initialCount.networks - resourcesAfter.networks),
		logs: itemsRemoved.logs,
		backups: itemsRemoved.backups,
	};

	return { itemsRemoved: actualRemoved };
}

function main(): void {
	console.log(`\n🐳 Docker Cleanup Tool - ${PROJECT_NAME}`);
	console.log(`Environment: ${env}`);
	console.log(`Project Label: ${PROJECT_LABEL}`);
	console.log(`Env Label: ${ENV_LABEL}`);
	console.log(`Mode: ${options.dryRun ? "DRY RUN" : "EXECUTE"}\n`);

	if (options.dryRun) {
		console.log("⚠️  DRY RUN MODE - No changes will be made\n");
	}

	const resourcesBefore = countCurrentResources();

	if (options.shutdown) {
		shutdownDockerServices();
	}

	const result =
		env === "production" ? cleanupProduction(resourcesBefore) : cleanupStaging(resourcesBefore);

	console.log("\n" + "=".repeat(50));
	console.log("CLEANUP COMPLETE");
	console.log("=".repeat(50));
	console.log(`Environment: ${env}`);
	console.log("\nItems Removed:");
	console.log(`  Containers: ${String(result.itemsRemoved.containers)}`);
	console.log(`  Images:     ${String(result.itemsRemoved.images)}`);
	console.log(`  Volumes:    ${String(result.itemsRemoved.volumes)}`);
	console.log(`  Networks:   ${String(result.itemsRemoved.networks)}`);
	console.log(`  Logs:       ${String(result.itemsRemoved.logs)}`);
	console.log(`  Backups:    ${String(result.itemsRemoved.backups)}`);
	console.log("=".repeat(50) + "\n");

	if (options.dryRun) {
		console.log("✅ Dry run completed - no changes made");
	}
}

main();
