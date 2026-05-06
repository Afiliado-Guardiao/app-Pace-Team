import { describe, expect, it } from "@jest/globals";

import { createUser } from "../../../../tests/fixtures";
import { createAuthHeaders } from "../../../../tests/helpers/authHelper";
import { getDatabase } from "../../../../tests/helpers/database";
import { getTestServer } from "../../../../tests/helpers/testServer";

interface AuthResponse {
	token: string;
	user: {
		id: string;
		email: string | null;
		name: string;
		referralCode: string;
		socialId: string | null;
		socialProvider: string | null;
		passwordHash?: never;
	};
}

interface JWTPayload {
	userId: string;
	email: string | null;
	name: string;
	referralCode: string;
	loginVersion: number;
	iat: number;
	exp: number;
}

function decodeJwtPayload(token: string): JWTPayload {
	const parts = token.split(".");
	const payloadPart = parts[1];
	if (!payloadPart) throw new Error("Invalid JWT structure");
	return JSON.parse(Buffer.from(payloadPart, "base64url").toString()) as JWTPayload;
}

describe("Auth Security Tests", () => {
	describe("Password Security", () => {
		it("should never return passwordHash in register response", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					email: "secure@example.com",
					password: "SecurePass123!",
					name: "Secure User",
				},
			});

			expect(response.statusCode).toBe(201);
			const body = JSON.parse(response.body) as AuthResponse;
			expect(body.user.passwordHash).toBeUndefined();
			expect(JSON.stringify(body)).not.toContain("passwordHash");
		});

		it("should hash password with bcrypt (hash starts with $2a$ or $2b$)", async () => {
			const app = getTestServer();
			const db = getDatabase();

			await app.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					email: "bcrypt@example.com",
					password: "Test@123",
					name: "Bcrypt User",
				},
			});

			const user = await db.user.findUnique({ where: { email: "bcrypt@example.com" } });

			expect(user?.passwordHash).toBeDefined();
			expect(user?.passwordHash).toMatch(/^\$2[ab]\$/);
			expect(user?.passwordHash).not.toBe("Test@123");
		});
	});

	describe("JWT and loginVersion", () => {
		it("should include loginVersion in JWT payload", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					email: "jwt@example.com",
					password: "Test@123",
					name: "JWT User",
				},
			});

			const { token } = JSON.parse(response.body) as AuthResponse;
			const payload = decodeJwtPayload(token);

			expect(payload.loginVersion).toBeDefined();
			expect(typeof payload.loginVersion).toBe("number");
			expect(payload.userId).toBeDefined();
			expect(payload.email).toBe("jwt@example.com");
		});

		it("should invalidate old token after password change (loginVersion mismatch)", async () => {
			const app = getTestServer();
			const db = getDatabase();

			const registerResponse = await app.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					email: "pwchange@example.com",
					password: "OldPass123!",
					name: "PwChange User",
				},
			});

			const { token: oldToken, user } = JSON.parse(registerResponse.body) as AuthResponse;

			// Simula troca de senha incrementando loginVersion diretamente
			await db.user.update({
				where: { id: user.id },
				data: { loginVersion: 99 },
			});

			const response = await app.inject({
				method: "GET",
				url: "/auth/me",
				headers: createAuthHeaders(oldToken),
			});

			expect(response.statusCode).toBe(401);
		});

		it("should set loginVersion to 1 by default for new users", async () => {
			const user = await createUser({ email: "defaultver@example.com" });

			expect(user.loginVersion).toBe(1);
		});
	});

	describe("Social Authentication", () => {
		it("should register new user with apple provider and return token", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "POST",
				url: "/auth/social",
				payload: {
					provider: "apple",
					socialId: "apple-secure-test-id-001",
					name: "Apple User",
					email: "apple.user@example.com",
				},
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body) as AuthResponse;
			expect(body.token).toBeDefined();
		});

		it("should register new user with google provider and return token", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "POST",
				url: "/auth/social",
				payload: {
					provider: "google",
					socialId: "google-secure-test-id-002",
					name: "Google User",
				},
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body) as AuthResponse;
			expect(body.token).toBeDefined();
		});

		it("should not expose passwordHash in social auth response", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "POST",
				url: "/auth/social",
				payload: {
					provider: "apple",
					socialId: "apple-nohash-test-id-003",
					name: "No Hash User",
				},
			});

			const body = JSON.parse(response.body) as AuthResponse;
			expect(body.user.passwordHash).toBeUndefined();
			expect(JSON.stringify(body)).not.toContain("passwordHash");
		});
	});

	describe("Referral Code Uniqueness", () => {
		it("should generate a unique referralCode for each registered user", async () => {
			const app = getTestServer();

			const r1 = await app.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					email: "user1unique@example.com",
					password: "Test@123",
					name: "User One",
				},
			});

			const r2 = await app.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					email: "user2unique@example.com",
					password: "Test@123",
					name: "User Two",
				},
			});

			const body1 = JSON.parse(r1.body) as AuthResponse;
			const body2 = JSON.parse(r2.body) as AuthResponse;

			expect(body1.user.referralCode).toBeDefined();
			expect(body2.user.referralCode).toBeDefined();
			expect(body1.user.referralCode).not.toBe(body2.user.referralCode);
		});
	});
});
