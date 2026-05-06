import { describe, expect, it } from "@jest/globals";

import { createOnboarding, createUser } from "../../../../tests/fixtures";
import { createAuthHeaders } from "../../../../tests/helpers/authHelper";
import { getTestServer } from "../../../../tests/helpers/testServer";

interface AuthResponse {
	token: string;
	user: {
		id: string;
		email: string | null;
		name: string;
	};
}

interface OnboardingData {
	id: string;
	anonymousUserId: string | null;
	name: string | null;
	email: string | null;
	birthday: string | null;
	completed: boolean;
	completedAt: string | null;
	userId: string | null;
	createdAt: string;
	updatedAt: string;
}

type OnboardingResponse = OnboardingData;

async function loginUser(
	app: ReturnType<typeof getTestServer>,
	email: string,
	password = "Test@123",
): Promise<string> {
	const res = await app.inject({
		method: "POST",
		url: "/auth/login",
		payload: { email, password },
	});
	return (JSON.parse(res.body) as AuthResponse).token;
}

describe("Onboarding Integration Tests", () => {
	describe("POST /onboarding", () => {
		it("should create onboarding with anonymousUserId and return 201", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "POST",
				url: "/onboarding",
				payload: { anonymousUserId: "anon-device-abc-001" },
			});

			expect(response.statusCode).toBe(201);
			const body = JSON.parse(response.body) as OnboardingResponse;
			expect(body).toBeDefined();
			expect(body.id).toBeDefined();
			expect(body.anonymousUserId).toBe("anon-device-abc-001");
		});

		it("should be idempotent — return existing onboarding for same anonymousUserId", async () => {
			const app = getTestServer();
			const anonymousUserId = "anon-idempotent-002";

			const first = await app.inject({
				method: "POST",
				url: "/onboarding",
				payload: { anonymousUserId },
			});

			const second = await app.inject({
				method: "POST",
				url: "/onboarding",
				payload: { anonymousUserId },
			});

			const body1 = JSON.parse(first.body) as OnboardingResponse;
			const body2 = JSON.parse(second.body) as OnboardingResponse;

			expect(body1.id).toBe(body2.id);
		});
	});

	describe("PATCH /onboarding/:id", () => {
		it("should update name", async () => {
			const app = getTestServer();
			const onboarding = await createOnboarding({ name: "Old Name" });

			const response = await app.inject({
				method: "PATCH",
				url: `/onboarding/${onboarding.id}`,
				payload: { name: "Updated Name" },
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body) as OnboardingResponse;
			expect(body.name).toBe("Updated Name");
		});

		it("should update email", async () => {
			const app = getTestServer();
			const onboarding = await createOnboarding();

			const response = await app.inject({
				method: "PATCH",
				url: `/onboarding/${onboarding.id}`,
				payload: { email: "updated@example.com" },
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body) as OnboardingResponse;
			expect(body.email).toBe("updated@example.com");
		});

		it("should update birthday", async () => {
			const app = getTestServer();
			const onboarding = await createOnboarding();

			const response = await app.inject({
				method: "PATCH",
				url: `/onboarding/${onboarding.id}`,
				payload: { birthday: "1995-06-15" },
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body) as OnboardingResponse;
			expect(body.birthday).toBe("1995-06-15");
		});

		it("should set completedAt when completed=true is sent", async () => {
			const app = getTestServer();
			const onboarding = await createOnboarding({ completed: false });

			const response = await app.inject({
				method: "PATCH",
				url: `/onboarding/${onboarding.id}`,
				payload: { completed: true },
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body) as OnboardingResponse;
			expect(body.completed).toBe(true);
			expect(body.completedAt).not.toBeNull();
		});
	});

	describe("GET /onboarding/:id", () => {
		it("should return existing onboarding", async () => {
			const app = getTestServer();
			const onboarding = await createOnboarding({ name: "Fetched User", email: "fetch@example.com" });

			const response = await app.inject({
				method: "GET",
				url: `/onboarding/${onboarding.id}`,
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body) as OnboardingResponse;
			expect(body.id).toBe(onboarding.id);
			expect(body.name).toBe("Fetched User");
		});

		it("should return 404 for non-existent onboarding id", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "GET",
				url: "/onboarding/00000000-0000-0000-0000-000000000000",
			});

			expect(response.statusCode).toBe(404);
		});
	});

	describe("POST /onboarding/link-to-user", () => {
		it("should link onboarding to authenticated user, mark completed, and copy fields to user", async () => {
			const app = getTestServer();
			const { getDatabase } = await import("../../../../tests/helpers/database");
			const db = getDatabase();

			const user = await createUser({ email: "link@example.com" });
			const onboarding = await createOnboarding({
				name: "Link Name",
				email: "linkonboarding@example.com",
				birthday: "1988-03-10",
			});

			const token = await loginUser(app, user.email ?? "");

			const response = await app.inject({
				method: "POST",
				url: "/onboarding/link-to-user",
				headers: createAuthHeaders(token),
				payload: { onboardingId: onboarding.id },
			});

			expect(response.statusCode).toBe(200);

			const linked = await db.onboarding.findUnique({ where: { id: onboarding.id } });
			expect(linked?.userId).toBe(user.id);
			expect(linked?.completed).toBe(true);
		});

		it("should return 409 when onboarding is already linked to another user", async () => {
			const app = getTestServer();

			const user1 = await createUser({ email: "alreadylinked1@example.com" });
			const user2 = await createUser({ email: "alreadylinked2@example.com" });
			const onboarding = await createOnboarding({ userId: user1.id });

			const token2 = await loginUser(app, user2.email ?? "");

			const response = await app.inject({
				method: "POST",
				url: "/onboarding/link-to-user",
				headers: createAuthHeaders(token2),
				payload: { onboardingId: onboarding.id },
			});

			expect(response.statusCode).toBe(409);
		});

		it("should return 401 without auth token", async () => {
			const app = getTestServer();
			const onboarding = await createOnboarding();

			const response = await app.inject({
				method: "POST",
				url: "/onboarding/link-to-user",
				payload: { onboardingId: onboarding.id },
			});

			expect(response.statusCode).toBe(401);
		});
	});
});
