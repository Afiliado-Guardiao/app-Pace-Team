require("@testing-library/react-native/extend-expect");

jest.mock("@react-native-async-storage/async-storage", () =>
	require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("@/lib/api/auth", () => ({
	authApi: {
		loginWithSocial: jest.fn(),
		register: jest.fn(),
		loginWithEmail: jest.fn(),
	},
}));

jest.mock("@/lib/api/onboarding", () => ({
	onboardingApi: {
		createOnboarding: jest.fn(),
		updateOnboarding: jest.fn(),
		getOnboarding: jest.fn(),
		linkToUser: jest.fn(),
	},
}));

jest.mock("expo-router", () => ({
	useRouter: () => ({
		push: jest.fn(),
		replace: jest.fn(),
		back: jest.fn(),
	}),
	useSegments: () => [],
	usePathname: () => "/",
}));
