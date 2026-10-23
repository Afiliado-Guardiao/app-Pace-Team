import { useStore } from "@/store";

export function resetAllStores(): void {
	useStore.setState({
		user: null,
		isAuthenticated: false,
		hasSeenReferralPrompt: false,
		currentStepIndex: 0,
		answers: {},
		isCompleted: false,
		language: null,
		lastRoute: null,
		_hasHydrated: false,
		hasTeam: true,
		viradaState: "equal",
		hasSeenVirada: false,
		myPosts: [],
		hasJustPosted: false,
	});
}

export function mockAuthenticatedUser(): void {
	useStore.setState({
		user: {
			id: "test-user-id",
			email: "test@example.com",
			name: "Test User",
			birthday: null,
			referralCode: "TEST123",
			isPremium: false,
			createdAt: new Date().toISOString(),
		},
		isAuthenticated: true,
	});
}
