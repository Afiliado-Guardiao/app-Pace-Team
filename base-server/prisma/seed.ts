import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

async function main(): Promise<void> {
	const adminPassword = "Admin@123";
	const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);

	const admin = await prisma.user.upsert({
		where: { email: "admin@example.com" },
		update: {},
		create: {
			email: "admin@example.com",
			name: "Admin",
			passwordHash,
			referralCode: "ADMIN",
			loginVersion: 1,
		},
	});

	await prisma.onboarding.upsert({
		where: { userId: admin.id },
		update: {},
		create: {
			userId: admin.id,
			name: admin.name,
			email: admin.email,
			completed: true,
			completedAt: new Date(),
		},
	});
}

main()
	.catch(() => {
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
