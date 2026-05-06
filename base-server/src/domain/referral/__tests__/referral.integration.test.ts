import { describe, expect, it } from "@jest/globals";

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

interface ApplyReferralResponse {
	usedCode: string;
	referrer: { name: string };
}

interface StatsResponse {
	myCode: string;
	usedCode: string | null;
	referralsCount: number;
}

async function registerUser(email: string, name = "User"): Promise<AuthResponse> {
	const app = getTestServer();
	const response = await app.inject({
		method: "POST",
		url: "/auth/register",
		payload: { email, password: "Test@123", name },
	});
	return JSON.parse(response.body) as AuthResponse;
}

describe("Referral Integration Tests", () => {
	describe("POST /users/me/referral", () => {
		it("should apply a valid referral code", async () => {
			const app = getTestServer();
			const referrer = await registerUser("ref-owner@example.com", "Referrer Name");
			const invitee = await registerUser("invitee@example.com", "Invitee");

			const response = await app.inject({
				method: "POST",
				url: "/users/me/referral",
				headers: createAuthHeaders(invitee.token),
				payload: { code: referrer.user.referralCode },
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body) as ApplyReferralResponse;
			expect(body.usedCode).toBe(referrer.user.referralCode);
			expect(body.referrer.name).toBe("Referrer Name");
		});

		it("should return 404 for non-existent code", async () => {
			const app = getTestServer();
			const user = await registerUser("lookup@example.com");

			const response = await app.inject({
				method: "POST",
				url: "/users/me/referral",
				headers: createAuthHeaders(user.token),
				payload: { code: "NONEXIST" },
			});

			expect(response.statusCode).toBe(404);
		});

		it("should reject self-referral", async () => {
			const app = getTestServer();
			const user = await registerUser("self@example.com");

			const response = await app.inject({
				method: "POST",
				url: "/users/me/referral",
				headers: createAuthHeaders(user.token),
				payload: { code: user.user.referralCode },
			});

			expect(response.statusCode).toBe(400);
		});

		it("should reject applying twice", async () => {
			const app = getTestServer();
			const referrer = await registerUser("ref2@example.com");
			const invitee = await registerUser("invitee2@example.com");

			await app.inject({
				method: "POST",
				url: "/users/me/referral",
				headers: createAuthHeaders(invitee.token),
				payload: { code: referrer.user.referralCode },
			});

			const second = await app.inject({
				method: "POST",
				url: "/users/me/referral",
				headers: createAuthHeaders(invitee.token),
				payload: { code: referrer.user.referralCode },
			});

			expect(second.statusCode).toBe(409);
		});

		it("should reject invalid code format", async () => {
			const app = getTestServer();
			const user = await registerUser("invalid-format@example.com");

			const response = await app.inject({
				method: "POST",
				url: "/users/me/referral",
				headers: createAuthHeaders(user.token),
				payload: { code: "ab" },
			});

			expect(response.statusCode).toBe(422);
		});

		it("should apply a valid code in lowercase", async () => {
			const app = getTestServer();
			const referrer = await registerUser("ref-lowercase@example.com", "Referrer Lower");
			const invitee = await registerUser("invitee-lower@example.com", "Invitee Lower");

			const response = await app.inject({
				method: "POST",
				url: "/users/me/referral",
				headers: createAuthHeaders(invitee.token),
				payload: { code: referrer.user.referralCode.toLowerCase() },
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body) as ApplyReferralResponse;
			expect(body.usedCode).toBe(referrer.user.referralCode);
			expect(body.referrer.name).toBe("Referrer Lower");
		});

		it("should normalize whitespace and mixed case", async () => {
			const app = getTestServer();
			const referrer = await registerUser("ref-mixed@example.com", "Referrer Mixed");
			const invitee = await registerUser("invitee-mixed@example.com", "Invitee Mixed");

			const mixedInput = ` ${referrer.user.referralCode.toLowerCase()} `;

			const response = await app.inject({
				method: "POST",
				url: "/users/me/referral",
				headers: createAuthHeaders(invitee.token),
				payload: { code: mixedInput },
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body) as ApplyReferralResponse;
			expect(body.usedCode).toBe(referrer.user.referralCode);
		});

		it("should reject self-referral case-insensitive", async () => {
			const app = getTestServer();
			const user = await registerUser("self-lower@example.com");

			const response = await app.inject({
				method: "POST",
				url: "/users/me/referral",
				headers: createAuthHeaders(user.token),
				payload: { code: user.user.referralCode.toLowerCase() },
			});

			expect(response.statusCode).toBe(400);
		});

		it("should return 401 without authorization", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "POST",
				url: "/users/me/referral",
				payload: { code: "ANYCODE123" },
			});

			expect(response.statusCode).toBe(401);
		});
	});

	describe("GET /users/me/referral", () => {
		it("should return stats with null usedCode when no referral applied", async () => {
			const app = getTestServer();
			const user = await registerUser("stats-null@example.com");

			const response = await app.inject({
				method: "GET",
				url: "/users/me/referral",
				headers: createAuthHeaders(user.token),
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body) as StatsResponse;
			expect(body.myCode).toBe(user.user.referralCode);
			expect(body.usedCode).toBeNull();
			expect(body.referralsCount).toBe(0);
		});

		it("should include usedCode after applying", async () => {
			const app = getTestServer();
			const referrer = await registerUser("ref3@example.com");
			const invitee = await registerUser("invitee3@example.com");

			await app.inject({
				method: "POST",
				url: "/users/me/referral",
				headers: createAuthHeaders(invitee.token),
				payload: { code: referrer.user.referralCode },
			});

			const response = await app.inject({
				method: "GET",
				url: "/users/me/referral",
				headers: createAuthHeaders(invitee.token),
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body) as StatsResponse;
			expect(body.usedCode).toBe(referrer.user.referralCode);
		});

		it("should count referrals correctly", async () => {
			const app = getTestServer();
			const referrer = await registerUser("ref-count@example.com");
			const invitee1 = await registerUser("invitee-a@example.com");
			const invitee2 = await registerUser("invitee-b@example.com");

			await app.inject({
				method: "POST",
				url: "/users/me/referral",
				headers: createAuthHeaders(invitee1.token),
				payload: { code: referrer.user.referralCode },
			});
			await app.inject({
				method: "POST",
				url: "/users/me/referral",
				headers: createAuthHeaders(invitee2.token),
				payload: { code: referrer.user.referralCode },
			});

			const response = await app.inject({
				method: "GET",
				url: "/users/me/referral",
				headers: createAuthHeaders(referrer.token),
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body) as StatsResponse;
			expect(body.myCode).toBe(referrer.user.referralCode);
			expect(body.referralsCount).toBe(2);
		});

		it("should return 401 without authorization", async () => {
			const app = getTestServer();

			const response = await app.inject({
				method: "GET",
				url: "/users/me/referral",
			});

			expect(response.statusCode).toBe(401);
		});
	});

	describe("2.T — FK cascade: delete referrer", () => {
		it("should set referredById to null but preserve referredByCode snapshot when referrer is deleted", async () => {
			const app = getTestServer();
			const db = getDatabase();

			const referrer = await registerUser("referrer-delete@example.com", "Referrer Delete");
			const invitee = await registerUser("invitee-delete@example.com", "Invitee Delete");

			// Aplica código de indicação
			const applyResponse = await app.inject({
				method: "POST",
				url: "/users/me/referral",
				headers: createAuthHeaders(invitee.token),
				payload: { code: referrer.user.referralCode },
			});
			expect(applyResponse.statusCode).toBe(200);

			// Deleta o referenciador (cascade: Onboarding deletado primeiro por causa da FK Onboarding→User)
			await db.onboarding.deleteMany({ where: { userId: referrer.user.id } });
			await db.user.delete({ where: { id: referrer.user.id } });

			// Verifica estado raw do DB pro convidado
			const inviteeRow = await db.user.findUnique({
				where: { id: invitee.user.id },
				select: { referredByCode: true, referredById: true },
			});

			expect(inviteeRow).not.toBeNull();
			// Snapshot preservado
			expect(inviteeRow?.referredByCode).toBe(referrer.user.referralCode);
			// FK setada pra null por ON DELETE SET NULL
			expect(inviteeRow?.referredById).toBeNull();
		});
	});

	describe("4.T — normalizeReferralCode edge cases", () => {
		it("should reject 422 when normalized code is too short (all special chars stripped)", async () => {
			const app = getTestServer();
			const user = await registerUser("special-chars@example.com");

			// "@#$!" normaliza pra "" (vazio) → falha min(4) do Zod
			const response = await app.inject({
				method: "POST",
				url: "/users/me/referral",
				headers: createAuthHeaders(user.token),
				payload: { code: "@#$!" },
			});

			expect(response.statusCode).toBe(422);
		});

		it("should strip special chars and treat 'ABC@123!' as 'ABC123' (404 since not a real code)", async () => {
			const app = getTestServer();
			const user = await registerUser("special-chars2@example.com");

			const response = await app.inject({
				method: "POST",
				url: "/users/me/referral",
				headers: createAuthHeaders(user.token),
				payload: { code: "ABC@123!" },
			});

			expect(response.statusCode).toBe(404);
		});
	});
});
