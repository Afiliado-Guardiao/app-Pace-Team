import { execSync } from "child_process";

import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

const COMPOSE_FILE = "docker/test/docker-compose.test.yml";
const CONTAINER_NAME = "pushtime-postgres-test";
const NETWORK_NAME = "pushtime-test-network";

function isContainerRunning(): boolean {
	try {
		const result = execSync(`docker exec ${CONTAINER_NAME} pg_isready -U postgres`, {
			stdio: "pipe",
		});
		return result.toString().includes("accepting connections");
	} catch {
		return false;
	}
}

function startTestDatabase(): void {
	// Remove container/rede órfãos de execuções anteriores
	try {
		execSync(`docker compose -f ${COMPOSE_FILE} down -v --remove-orphans`, {
			cwd: process.cwd(),
			stdio: "pipe",
		});
	} catch {
		// Pode não existir
	}

	try {
		execSync(`docker rm -f ${CONTAINER_NAME} 2>/dev/null; docker network rm ${NETWORK_NAME} 2>/dev/null`, {
			cwd: process.cwd(),
			stdio: "pipe",
			shell: "/bin/sh",
		});
	} catch {
		// Não é fatal
	}

	execSync(`docker compose -f ${COMPOSE_FILE} up -d --force-recreate`, {
		cwd: process.cwd(),
		stdio: "pipe",
	});
}

async function waitForDatabase(): Promise<void> {
	let retries = 30;
	while (retries > 0) {
		try {
			execSync(`docker exec ${CONTAINER_NAME} pg_isready -U postgres`, {
				stdio: "pipe",
			});
			return;
		} catch {
			retries--;
			if (retries === 0) {
				throw new Error("Banco de teste não ficou pronto a tempo");
			}
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}
}

export async function setupDatabase(): Promise<PrismaClient> {
	const databaseUrl = process.env.DATABASE_URL_TEST;

	if (!databaseUrl) {
		throw new Error("DATABASE_URL_TEST deve estar definida");
	}

	if (!databaseUrl.includes("pushtime_test")) {
		throw new Error("DATABASE_URL_TEST deve apontar para o banco de teste (pushtime_test)");
	}

	// Só sobe o container se não estiver rodando
	if (!isContainerRunning()) {
		startTestDatabase();
		await waitForDatabase();
	}

	execSync("npx prisma db push --skip-generate --accept-data-loss", {
		cwd: process.cwd(),
		env: { ...process.env, DATABASE_URL: databaseUrl },
		stdio: "pipe",
	});

	execSync("npx prisma generate", {
		cwd: process.cwd(),
		stdio: "pipe",
	});

	prisma = new PrismaClient({
		datasources: {
			db: {
				url: databaseUrl,
			},
		},
	});

	await prisma.$connect();

	return prisma;
}

export async function clearDatabase(): Promise<void> {
	if (!prisma) {
		throw new Error("Banco não inicializado. Chame setupDatabase() primeiro.");
	}

	await prisma.onboarding.deleteMany();
	await prisma.user.deleteMany();
}

export async function teardownDatabase(): Promise<void> {
	if (prisma) {
		await prisma.$disconnect();
		prisma = null;
	}

	try {
		execSync(`docker compose -f ${COMPOSE_FILE} down -v`, {
			cwd: process.cwd(),
			stdio: "pipe",
		});
	} catch {
		// Falha no teardown não é fatal
	}
}

export function getDatabase(): PrismaClient {
	if (!prisma) {
		throw new Error("Banco não inicializado. Chame setupDatabase() primeiro.");
	}
	return prisma;
}
