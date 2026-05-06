import { useStore } from "@/store";

export function resetAllStores(): void {
	useStore.setState({
		user: null,
		token: null,
		isAuthenticated: false,
		hasHydrated: false,
		hasSeenReferralPrompt: false,
		currentStepIndex: 0,
		answers: {},
		isCompleted: false,
		onboardingId: null,
		anonymousUserId: null,
		language: null,
		lastRoute: null,
		_hasHydrated: false,
	});
}

export function mockAuthenticatedUser(): void {
	useStore.setState({
		user: {
			id: "test-user-id",
			email: "test@example.com",
			name: "Test User",
			referralCode: "TEST123",
			createdAt: new Date().toISOString(),
		},
		token: "mock-jwt-token",
		isAuthenticated: true,
	});
}
