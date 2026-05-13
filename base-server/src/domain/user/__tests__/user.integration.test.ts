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
	};
}

interface UserProfileResponse {
	id: string;
	email: string | null;
	name: string;
	birthday: string | null;
	referralCode: string;
	createdAt: string;
	updatedAt: string;
}

async function registerAndGetToken(
	app: Awaited<
		ReturnType<(typeof import("../../../../tests/helpers/testServer"))["getTestServer"]>
	>,
	email: string,
	password = "Test@123",
	name = "Test User",
): Promise<{ token: string; user: AuthResponse["user"] }> {
	const response = await app.inject({
		method: "POST",
		url: "/auth/register",
		payload: { email, password, name },
	});
	return JSON.parse(response.body) as { token: string; user: AuthResponse["user"] };
}

describe("User Integration Tests", () => {
	describe("GET /users/me", () => {
		it("should return profile of the authenticated user", async () => {
			const app = getTestServer();
			const { token, user } = await registerAndGetToken(app, "getme@example.com");

			const response = await app.inject({
				method: "GET",
				url: "/users/me",
				headers: createAuthHeaders(token),
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body) as UserProfileResponse;
			expect(body.id).toBe(user.id);
			expect(body.email).toBe(user.email);
			expect((body as unknown as Record<string, unknown>)["passwordHash"]).toBeUndefined();
		});

		it("should return 401 without authorization header", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "GET",
				url: "/users/me",
			});

			expect(response.statusCode).toBe(401);
		});
	});

	describe("PATCH /users/me", () => {
		it("should update name", async () => {
			const app = getTestServer();
			const db = getDatabase();
			const { token, user } = await registerAndGetToken(
				app,
				"updatename@example.com",
				"Test@123",
				"Old Name",
			);

			const response = await app.inject({
				method: "PATCH",
				url: "/users/me",
				headers: createAuthHeaders(token),
				payload: { name: "New Name" },
			});

			expect(response.statusCode).toBe(200);
			const dbUser = await db.user.findUnique({ where: { id: user.id } });
			expect(dbUser?.name).toBe("New Name");
		});

		it("should update email", async () => {
			const app = getTestServer();
			const db = getDatabase();
			const { token, user } = await registerAndGetToken(app, "oldemail@example.com");

			const response = await app.inject({
				method: "PATCH",
				url: "/users/me",
				headers: createAuthHeaders(token),
				payload: { email: "newemail@example.com" },
			});

			expect(response.statusCode).toBe(200);
			const dbUser = await db.user.findUnique({ where: { id: user.id } });
			expect(dbUser?.email).toBe("newemail@example.com");
		});

		it("should update birthday", async () => {
			const app = getTestServer();
			const db = getDatabase();
			const { token, user } = await registerAndGetToken(app, "birthday@example.com");

			const response = await app.inject({
				method: "PATCH",
				url: "/users/me",
				headers: createAuthHeaders(token),
				payload: { birthday: "1992-07-15" },
			});

			expect(response.statusCode).toBe(200);
			const dbUser = await db.user.findUnique({ where: { id: user.id } });
			expect(dbUser?.birthday).toBe("1992-07-15");
		});

		it("should return 409 when updating email to one already taken", async () => {
			const app = getTestServer();
			await createUser({ email: "taken@example.com" });
			const { token } = await registerAndGetToken(app, "will-conflict@example.com");

			const response = await app.inject({
				method: "PATCH",
				url: "/users/me",
				headers: createAuthHeaders(token),
				payload: { email: "taken@example.com" },
			});

			expect(response.statusCode).toBe(409);
		});
	});

	describe("PATCH /users/me/password", () => {
		it("should update password with correct current password and return 204", async () => {
			const app = getTestServer();
			const db = getDatabase();
			const { token, user } = await registerAndGetToken(
				app,
				"changepass@example.com",
				"OldPass@123",
			);

			const response = await app.inject({
				method: "PATCH",
				url: "/users/me/password",
				headers: createAuthHeaders(token),
				payload: {
					currentPassword: "OldPass@123",
					newPassword: "NewPass@456",
				},
			});

			expect(response.statusCode).toBe(204);

			// loginVersion deve ter incrementado, então o token antigo agora é inválido
			const dbUser = await db.user.findUnique({ where: { id: user.id } });
			expect(dbUser?.loginVersion).toBeGreaterThan(1);
		});

		it("should return 401 when current password is wrong", async () => {
			const app = getTestServer();
			const { token } = await registerAndGetToken(app, "wrongcur@example.com", "CorrectPass@123");

			const response = await app.inject({
				method: "PATCH",
				url: "/users/me/password",
				headers: createAuthHeaders(token),
				payload: {
					currentPassword: "WrongCurrent@999",
					newPassword: "NewPass@456",
				},
			});

			expect(response.statusCode).toBe(401);
		});
	});

	describe("DELETE /users/me", () => {
		it("should delete the authenticated user and cascade-remove their records", async () => {
			const app = getTestServer();
			const db = getDatabase();
			const { token, user } = await registerAndGetToken(app, "deleteuser@example.com");

			const response = await app.inject({
				method: "DELETE",
				url: "/users/me",
				headers: createAuthHeaders(token),
			});

			expect(response.statusCode).toBe(204);

			const deleted = await db.user.findUnique({ where: { id: user.id } });
			expect(deleted).toBeNull();
		});

		it("should delete associated onboarding records when user is deleted", async () => {
			const app = getTestServer();
			const db = getDatabase();
			const { token, user } = await registerAndGetToken(app, "deletewithobd@example.com");

			// Cria um onboarding vinculado a este usuário
			const onboarding = await db.onboarding.create({
				data: {
					anonymousUserId: "anon-cascade-test",
					userId: user.id,
					name: "Test",
					email: user.email,
					completed: false,
				},
			});

			await app.inject({
				method: "DELETE",
				url: "/users/me",
				headers: createAuthHeaders(token),
			});

			const deletedOnboarding = await db.onboarding.findUnique({ where: { id: onboarding.id } });
			expect(deletedOnboarding).toBeNull();
		});
	});
});
