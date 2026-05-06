import { describe, expect, it } from "@jest/globals";
import { sign } from "jsonwebtoken";

import { createOnboardingWithSubscription } from "../../../../tests/fixtures";
import { createAuthHeaders } from "../../../../tests/helpers/authHelper";
import { getDatabase } from "../../../../tests/helpers/database";
import { getTestServer } from "../../../../tests/helpers/testServer";

interface AuthResponse {
	token: string;
	user: { id: string; email: string | null; name: string; referralCode: string };
}

describe("Auth Middleware Integration Tests", () => {
	describe("Authorization header validation", () => {
		it("should reject request without Authorization header", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "GET",
				url: "/auth/me",
			});

			expect(response.statusCode).toBe(401);
			const body = JSON.parse(response.body) as { error: string };
			expect(body.error).toBeDefined();
		});

		it("should reject request with empty Authorization header", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "GET",
				url: "/auth/me",
				headers: { Authorization: "" },
			});

			expect(response.statusCode).toBe(401);
			const body = JSON.parse(response.body) as { error: string };
			expect(body.error).toBeDefined();
		});

		it("should reject request with non-Bearer token type", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "GET",
				url: "/auth/me",
				headers: { Authorization: "Basic xyz" },
			});

			expect(response.statusCode).toBe(401);
			const body = JSON.parse(response.body) as { error: string };
			expect(body.error).toBeDefined();
		});

		it("should reject request with Bearer but no token", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "GET",
				url: "/auth/me",
				headers: { Authorization: "Bearer " },
			});

			expect(response.statusCode).toBe(401);
			const body = JSON.parse(response.body) as { error: string };
			expect(body.error).toBeDefined();
		});
	});

	describe("Token validation", () => {
		it("should reject request with malformed JWT", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "GET",
				url: "/auth/me",
				headers: createAuthHeaders("not.a.jwt"),
			});

			expect(response.statusCode).toBe(401);
			const body = JSON.parse(response.body) as { error: string };
			expect(body.error).toBeDefined();
		});

		it("should reject request with token signed with wrong secret", async () => {
			const app = getTestServer();

			const fakeToken = sign(
				{ userId: "some-user-id", email: "fake@example.com", name: "Fake", loginVersion: 1 },
				"wrong-secret",
				{ expiresIn: "1h" },
			);

			const response = await app.inject({
				method: "GET",
				url: "/auth/me",
				headers: createAuthHeaders(fakeToken),
			});

			expect(response.statusCode).toBe(401);
			const body = JSON.parse(response.body) as { error: string };
			expect(body.error).toBeDefined();
		});

		it("should accept request with valid token", async () => {
			const app = getTestServer();
			const onboarding = await createOnboardingWithSubscription();

			const registerResponse = await app.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					email: "middleware-valid@example.com",
					password: "SecurePass123!",
					name: "Valid User",
					onboardingId: onboarding.id,
				},
			});

			const { token } = JSON.parse(registerResponse.body) as AuthResponse;

			const response = await app.inject({
				method: "GET",
				url: "/auth/me",
				headers: createAuthHeaders(token),
			});

			expect(response.statusCode).toBe(200);
		});
	});

	describe("Login version validation", () => {
		it("should reject token after loginVersion is incremented (session invalidation)", async () => {
			const app = getTestServer();
			const db = getDatabase();
			const onboarding = await createOnboardingWithSubscription();

			const registerResponse = await app.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					email: "middleware-logout@example.com",
					password: "SecurePass123!",
					name: "Logout User",
					onboardingId: onboarding.id,
				},
			});

			const { token, user } = JSON.parse(registerResponse.body) as AuthResponse;

			await db.user.update({
				where: { id: user.id },
				data: { loginVersion: { increment: 1 } },
			});

			const response = await app.inject({
				method: "GET",
				url: "/auth/me",
				headers: createAuthHeaders(token),
			});

			expect(response.statusCode).toBe(401);
			const body = JSON.parse(response.body) as { error: string };
			expect(body.error).toBeDefined();
		});

		it("should accept token with current loginVersion", async () => {
			const app = getTestServer();
			const onboarding = await createOnboardingWithSubscription();

			const registerResponse = await app.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					email: "middleware-current-version@example.com",
					password: "SecurePass123!",
					name: "Current Version User",
					onboardingId: onboarding.id,
				},
			});

			const { token } = JSON.parse(registerResponse.body) as AuthResponse;

			const response = await app.inject({
				method: "GET",
				url: "/auth/me",
				headers: createAuthHeaders(token),
			});

			expect(response.statusCode).toBe(200);
		});
	});
});
