import { User } from "@prisma/client";

export function createAuthHeaders(token: string): Record<string, string> {
	return {
		Authorization: `Bearer ${token}`,
	};
}

export function extractToken(response: { headers: Record<string, string | string[]> }): string {
	const authHeader = response.headers.authorization;

	if (!authHeader) {
		throw new Error("No authorization header in response");
	}

	const token = Array.isArray(authHeader) ? authHeader[0] : authHeader;

	if (!token || !token.startsWith("Bearer ")) {
		throw new Error("Invalid authorization header format");
	}

	return token.replace("Bearer ", "");
}

export function createMockUser(
	overrides?: Partial<User>,
): Omit<User, "id" | "createdAt" | "updatedAt"> {
	return {
		email: "test@example.com",
		name: "Test User",
		birthday: null,
		passwordHash: "$2a$10$AAAAAAAAAAAAAAAAAAAAAA",
		socialId: null,
		socialProvider: null,
		referralCode: "TEST123",
		referredByCode: null,
		referredById: null,
		loginVersion: 1,
		isPremium: false,
		...overrides,
	};
}
