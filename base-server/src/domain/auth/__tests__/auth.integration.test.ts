import { describe, expect, it } from "@jest/globals";

import { createUser } from "../../../../tests/fixtures";
import { createAuthHeaders } from "../../../../tests/helpers/authHelper";
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
		createdAt: string;
		updatedAt: string;
	};
}

interface MeResponse {
	user: {
		userId: string;
		email: string | null;
		name: string;
		referralCode: string;
	};
}

describe("Auth Integration Tests", () => {
	describe("POST /auth/register", () => {
		it("should register a new user and return 201 with token and referralCode", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					email: "newuser@example.com",
					password: "SecurePass123!",
					name: "New User",
				},
			});

			expect(response.statusCode).toBe(201);
			const body = JSON.parse(response.body) as AuthResponse;
			expect(body.token).toBeDefined();
			expect(body.user.email).toBe("newuser@example.com");
			expect(body.user.name).toBe("New User");
			expect(body.user.referralCode).toBeDefined();
			expect(typeof body.user.referralCode).toBe("string");
			expect(body.user.referralCode.length).toBeGreaterThan(0);
		});

		it("should accept optional birthday during registration", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					email: "birthday@example.com",
					password: "SecurePass123!",
					name: "Birthday User",
					birthday: "1990-05-20",
				},
			});

			expect(response.statusCode).toBe(201);
			const body = JSON.parse(response.body) as AuthResponse;
			expect(body.token).toBeDefined();
		});

		it("should reject duplicate email with 409", async () => {
			const app = getTestServer();
			await createUser({ email: "existing@example.com" });

			const response = await app.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					email: "existing@example.com",
					password: "SecurePass123!",
					name: "Duplicate User",
				},
			});

			expect(response.statusCode).toBe(409);
		});

		it("should reject invalid email with 422", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					email: "not-an-email",
					password: "SecurePass123!",
					name: "Test User",
				},
			});

			expect(response.statusCode).toBe(422);
		});

		it("should reject short password with 422", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					email: "test@example.com",
					password: "123",
					name: "Test User",
				},
			});

			expect(response.statusCode).toBe(422);
		});
	});

	describe("POST /auth/login", () => {
		it("should login with valid credentials and return 200 with new token", async () => {
			const app = getTestServer();
			const user = await createUser({ email: "login@example.com", password: "Test@123" });

			const response = await app.inject({
				method: "POST",
				url: "/auth/login",
				payload: {
					email: user.email,
					password: "Test@123",
				},
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body) as AuthResponse;
			expect(body.token).toBeDefined();
			expect(body.user.email).toBe(user.email);
		});

		it("should increment loginVersion on login", async () => {
			const app = getTestServer();
			const { getDatabase } = await import("../../../../tests/helpers/database");
			const db = getDatabase();
			const user = await createUser({ email: "loginver@example.com", password: "Test@123", loginVersion: 1 });

			await app.inject({
				method: "POST",
				url: "/auth/login",
				payload: {
					email: user.email,
					password: "Test@123",
				},
			});

			const updated = await db.user.findUnique({ where: { id: user.id } });
			expect(updated?.loginVersion).toBe(2);
		});

		it("should reject wrong password with 401", async () => {
			const app = getTestServer();
			const user = await createUser({ email: "wrongpass@example.com" });

			const response = await app.inject({
				method: "POST",
				url: "/auth/login",
				payload: {
					email: user.email,
					password: "WrongPassword999!",
				},
			});

			expect(response.statusCode).toBe(401);
		});

		it("should return 401 for non-existent user (same generic message)", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "POST",
				url: "/auth/login",
				payload: {
					email: "ghost@example.com",
					password: "Test@123",
				},
			});

			// Deve ser 401 (não 404) pra não vazar existência do usuário
			expect(response.statusCode).toBe(401);
		});
	});

	describe("POST /auth/social", () => {
		it("should create a new user and return token for unknown apple socialId", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "POST",
				url: "/auth/social",
				payload: {
					provider: "apple",
					socialId: "apple-unique-id-111",
					name: "Apple User",
					email: "apple@example.com",
				},
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body) as AuthResponse;
			expect(body.token).toBeDefined();
		});

		it("should return existing user token for known google socialId", async () => {
			const app = getTestServer();

			// Primeiro sign-in cria o usuário
			await app.inject({
				method: "POST",
				url: "/auth/social",
				payload: {
					provider: "google",
					socialId: "google-unique-id-222",
					name: "Google User",
					email: "google@example.com",
				},
			});

			// Segundo sign-in usa mesmo socialId
			const response = await app.inject({
				method: "POST",
				url: "/auth/social",
				payload: {
					provider: "google",
					socialId: "google-unique-id-222",
					name: "Google User",
					email: "google@example.com",
				},
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body) as AuthResponse;
			expect(body.token).toBeDefined();
		});
	});

	describe("GET /auth/me", () => {
		it("should return user shape without passwordHash with valid token", async () => {
			const app = getTestServer();

			const registerResponse = await app.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					email: "me@example.com",
					password: "Test@123",
					name: "Me User",
				},
			});

			const { token } = JSON.parse(registerResponse.body) as AuthResponse;

			const response = await app.inject({
				method: "GET",
				url: "/auth/me",
				headers: createAuthHeaders(token),
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body) as MeResponse;
			expect(body.user).toBeDefined();
			expect(body.user.userId).toBeDefined();
			expect((body.user as Record<string, unknown>)["passwordHash"]).toBeUndefined();
		});

		it("should return 401 without token", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "GET",
				url: "/auth/me",
			});

			expect(response.statusCode).toBe(401);
		});
	});

	describe("POST /auth/logout", () => {
		it("should logout and return 204", async () => {
			const app = getTestServer();

			const registerResponse = await app.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					email: "logout@example.com",
					password: "Test@123",
					name: "Logout User",
				},
			});

			const { token } = JSON.parse(registerResponse.body) as AuthResponse;

			const response = await app.inject({
				method: "POST",
				url: "/auth/logout",
				headers: createAuthHeaders(token),
			});

			expect(response.statusCode).toBe(204);
		});

		it("should increment loginVersion on logout", async () => {
			const app = getTestServer();
			const { getDatabase } = await import("../../../../tests/helpers/database");
			const db = getDatabase();

			const registerResponse = await app.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					email: "logoutver@example.com",
					password: "Test@123",
					name: "Logout Version User",
				},
			});

			const { token, user } = JSON.parse(registerResponse.body) as AuthResponse;
			const before = await db.user.findUnique({ where: { id: user.id } });

			await app.inject({
				method: "POST",
				url: "/auth/logout",
				headers: createAuthHeaders(token),
			});

			const after = await db.user.findUnique({ where: { id: user.id } });
			expect(after?.loginVersion).toBe((before?.loginVersion ?? 0) + 1);
		});

		it("should reject old token after logout with 401", async () => {
			const app = getTestServer();

			const registerResponse = await app.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					email: "oldtoken@example.com",
					password: "Test@123",
					name: "Old Token User",
				},
			});

			const { token } = JSON.parse(registerResponse.body) as AuthResponse;

			await app.inject({
				method: "POST",
				url: "/auth/logout",
				headers: createAuthHeaders(token),
			});

			const response = await app.inject({
				method: "GET",
				url: "/auth/me",
				headers: createAuthHeaders(token),
			});

			expect(response.statusCode).toBe(401);
		});
	});
});
