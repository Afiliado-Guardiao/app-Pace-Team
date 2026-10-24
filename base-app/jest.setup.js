require("@testing-library/react-native/extend-expect");

jest.mock("@react-native-async-storage/async-storage", () =>
	require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("@/lib/supabase", () => ({
	supabase: {},
	getCurrentUser: jest.fn().mockResolvedValue(null),
	syncAuthState: jest.fn().mockResolvedValue(undefined),
	ensureSession: jest.fn().mockResolvedValue(undefined),
	onAuthChange: jest.fn(() => ({ unsubscribe: jest.fn() })),
	signInWithEmail: jest.fn().mockResolvedValue(undefined),
	signUpWithEmail: jest.fn().mockResolvedValue(undefined),
	signInWithApple: jest.fn().mockResolvedValue(undefined),
	signInWithGoogle: jest.fn().mockResolvedValue(undefined),
	signOut: jest.fn().mockResolvedValue(undefined),
	updateUserEmail: jest.fn().mockResolvedValue(undefined),
	updateUserPassword: jest.fn().mockResolvedValue(undefined),
	deleteAccount: jest.fn().mockResolvedValue(undefined),
	updateProfile: jest.fn().mockResolvedValue(undefined),
	getMyOnboarding: jest.fn().mockResolvedValue(null),
	syncOnboarding: jest.fn().mockResolvedValue({
		id: "onboarding-test",
		userId: "user-test",
		name: null,
		email: null,
		birthday: null,
		completed: true,
		completedAt: new Date().toISOString(),
	}),
	applyReferralCode: jest.fn().mockResolvedValue({ usedCode: "", referrer: { name: "" } }),
	getReferralStats: jest.fn().mockResolvedValue({ myCode: "", usedCode: null, referralsCount: 0 }),
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

// RevenueCat: módulo nativo (StoreKit). Nos testes não há compras nem assinatura.
jest.mock("react-native-purchases", () => {
	const asyncNoop = jest.fn().mockResolvedValue(undefined);
	const emptyInfo = { entitlements: { active: {}, all: {} } };
	return {
		__esModule: true,
		default: {
			configure: jest.fn(),
			isConfigured: jest.fn().mockResolvedValue(true),
			isAnonymous: jest.fn().mockResolvedValue(true),
			logIn: jest.fn().mockResolvedValue({ customerInfo: emptyInfo, created: false }),
			logOut: jest.fn().mockResolvedValue(emptyInfo),
			getCustomerInfo: jest.fn().mockResolvedValue(emptyInfo),
			getOfferings: jest.fn().mockResolvedValue({ current: null, all: {} }),
			purchasePackage: asyncNoop,
			restorePurchases: jest.fn().mockResolvedValue(emptyInfo),
			showManageSubscriptions: asyncNoop,
			addCustomerInfoUpdateListener: jest.fn(),
			removeCustomerInfoUpdateListener: jest.fn(),
		},
		PACKAGE_TYPE: { MONTHLY: "MONTHLY", ANNUAL: "ANNUAL" },
	};
});

// expo-video: módulo nativo; nos testes o vídeo de fundo vira uma View vazia
jest.mock("expo-video", () => {
	const { View } = require("react-native");
	return {
		useVideoPlayer: () => ({
			play: jest.fn(),
			pause: jest.fn(),
			status: "idle",
			addListener: () => ({ remove: jest.fn() }),
		}),
		VideoView: View,
	};
});

jest.mock("expo-camera", () => {
	const { View } = require("react-native");
	return {
		CameraView: View,
		useCameraPermissions: () => [{ granted: false, canAskAgain: false }, jest.fn()],
	};
});

jest.mock("expo-image-picker", () => ({
	requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ granted: false })),
	launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: true, assets: null })),
}));

jest.mock("react-native-view-shot", () => ({
	captureRef: jest.fn(() => Promise.resolve("file:///story.png")),
}));

jest.mock("expo-sharing", () => ({
	isAvailableAsync: jest.fn(() => Promise.resolve(true)),
	shareAsync: jest.fn(() => Promise.resolve()),
}));
