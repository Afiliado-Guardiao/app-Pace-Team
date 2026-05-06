import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const COLORS = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	red: "\x1b[31m",
	cyan: "\x1b[36m",
};

function log(message: string, color: string = COLORS.reset): void {
	console.log(`${color}${message}${COLORS.reset}`);
}

function logStep(step: number, message: string): void {
	log(`\n[${String(step)}/7] ${message}`, COLORS.cyan);
}

function logSuccess(message: string): void {
	log(`✅ ${message}`, COLORS.green);
}

function logError(message: string): void {
	log(`❌ ${message}`, COLORS.red);
}

function logWarning(message: string): void {
	log(`⚠️  ${message}`, COLORS.yellow);
}

async function runCommand(command: string, description: string): Promise<void> {
	try {
		const { stdout, stderr } = await execAsync(command);
		if (stdout) console.log(stdout);
		if (stderr && !stderr.includes("npm WARN")) {
			logWarning(stderr);
		}
		logSuccess(description);
	} catch (error) {
		logError(`Failed: ${description}`);
		throw error;
	}
}

async function checkDockerRunning(): Promise<boolean> {
	try {
		await execAsync("docker ps");
		return true;
	} catch {
		return false;
	}
}

async function checkContainerExists(containerName: string): Promise<boolean> {
	try {
		const { stdout } = await execAsync(
			`docker ps -a --filter name=${containerName} --format "{{.Names}}"`,
		);
		return stdout.includes(containerName);
	} catch {
		return false;
	}
}

async function main(): Promise<void> {
	log("\n🚀 PushTime - Setup for Testing\n", COLORS.bright);
	log("This script will prepare your backend for testing on iPhone.\n");

	try {
		logStep(1, "Checking Docker installation...");
		const dockerRunning = await checkDockerRunning();
		if (!dockerRunning) {
			throw new Error("Docker is not running. Please start Docker Desktop and try again.");
		}
		logSuccess("Docker is running");

		logStep(2, "Starting Docker containers...");
		const containerExists = await checkContainerExists("pushtime-api-staging");
		if (containerExists) {
			log("Containers already exist, restarting...");
			await runCommand("npm run docker:down", "Stopped existing containers");
		}
		await runCommand("npm run docker:up", "Started Docker containers");

		logStep(3, "Waiting for database to be ready...");
		log("Waiting 5 seconds for PostgreSQL to initialize...");
		await new Promise((resolve) => setTimeout(resolve, 5000));
		logSuccess("Database should be ready");

		logStep(4, "Generating Prisma Client...");
		await runCommand("npm run prisma:generate", "Prisma Client generated");

		logStep(5, "Pushing database schema...");
		await runCommand("npm run docker:db:push", "Database schema synchronized");

		logStep(6, "Running seed (creating admin user + sample data)...");
		await runCommand("npm run db:seed", "Database seeded successfully");

		logStep(7, "Verifying setup...");
		await runCommand("npm run typecheck", "TypeScript check passed");

		log("\n" + "=".repeat(60), COLORS.green);
		log("🎉 Setup Complete! Backend is ready for testing.", COLORS.bright + COLORS.green);
		log("=".repeat(60) + "\n", COLORS.green);

		log("\n📋 Admin Login Credentials:\n", COLORS.bright);
		log(`   Email:    ${COLORS.cyan}admin@pushtime.com${COLORS.reset}`);
		log(`   Password: ${COLORS.cyan}Admin@123${COLORS.reset}\n`);

		log("📊 Sample Data Created:\n", COLORS.bright);
		log("   • 1 Admin user (onboarding completed)");
		log("   • 6 Challenges (easy, medium, hard)");
		log("   • 4 Workouts (quick, standard, endurance)");
		log("   • Initial user progress (streak = 0)\n");

		log("🔥 Next Steps:\n", COLORS.bright);
		log("   1. Start backend server:");
		log(`      ${COLORS.yellow}npm run dev${COLORS.reset}\n`);
		log("   2. Configure frontend .env with your local IP:");
		log(`      ${COLORS.yellow}API_URL=http://YOUR_IP:8080${COLORS.reset}\n`);
		log("   3. Build app for iPhone:");
		log(`      ${COLORS.yellow}cd ../pushtime-app && npx expo run:ios --device${COLORS.reset}\n`);
		log("   4. Login with admin credentials above\n");

		log(`📖 For detailed testing guide, see: ${COLORS.cyan}GUIA-TESTES.md${COLORS.reset}\n`);
	} catch (error) {
		logError("\n❌ Setup failed!");
		if (error instanceof Error) {
			log(error.message, COLORS.red);
		}
		process.exit(1);
	}
}

main().catch((error: unknown) => {
	console.error(error);
	process.exit(1);
});
