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

jest.mock("@virex-tech/paywallo-sdk", () => {
	const React = require("react");

	const noop = jest.fn();
	const asyncNoop = jest.fn().mockResolvedValue(undefined);

	return {
		PaywalloProvider: ({ children }) => React.createElement(React.Fragment, null, children),
		PaywalloClient: {
			init: asyncNoop,
			isReady: () => true,
			waitUntilReady: asyncNoop,
			identify: asyncNoop,
			track: asyncNoop,
			reset: asyncNoop,
			getDistinctId: () => "test-distinct-id",
			getDeviceId: () => "test-device-id",
			getEmail: () => null,
			getSessionFlag: () => null,
			getVariant: jest.fn().mockResolvedValue({ variant: null }),
			getVariantCached: jest.fn().mockResolvedValue({ variant: null }),
			evaluateFlags: jest.fn().mockResolvedValue({}),
			getConditionalFlag: jest.fn().mockResolvedValue(false),
			hasActiveSubscription: jest.fn().mockResolvedValue(false),
			getSubscription: jest.fn().mockResolvedValue(null),
			restorePurchases: jest.fn().mockResolvedValue({ success: true, restoredProducts: [] }),
			fullReset: asyncNoop,
			deleteUserData: asyncNoop,
		},
		usePaywallo: () => ({
			isInitialized: true,
			isReady: true,
			distinctId: "test-distinct-id",
			subscription: null,
			products: new Map(),
			isLoadingProducts: false,
			hasActiveSubscription: jest.fn().mockResolvedValue(false),
			getSubscription: jest.fn().mockResolvedValue(null),
			restorePurchases: jest.fn().mockResolvedValue({ success: true }),
		}),
		useSubscription: () => ({
			subscription: null,
			isActive: false,
			isLoading: false,
			error: null,
			entitlements: [],
			refresh: asyncNoop,
			restore: asyncNoop,
		}),
		usePurchase: () => ({
			state: "idle",
			purchase: jest.fn().mockResolvedValue({ status: "cancelled" }),
			restore: jest.fn().mockResolvedValue([]),
			error: null,
			isPurchasing: false,
			isRestoring: false,
		}),
		useProducts: () => ({
			products: [],
			formattedProducts: [],
			isLoading: false,
			error: null,
			loadProducts: asyncNoop,
			getProduct: noop,
			getFormattedProduct: noop,
			getPriceInfo: noop,
		}),
		useOnboarding: () => ({
			step: asyncNoop,
			complete: asyncNoop,
		}),
		syncSuperwallAttributes: jest.fn().mockResolvedValue("skipped"),
	};
});

jest.mock("expo-superwall", () => {
	const React = require("react");

	const asyncNoop = jest.fn().mockResolvedValue(undefined);

	return {
		SuperwallProvider: ({ children }) => React.createElement(React.Fragment, null, children),
		SuperwallLoading: () => null,
		SuperwallLoaded: ({ children }) => React.createElement(React.Fragment, null, children),
		CustomPurchaseControllerProvider: ({ children }) =>
			React.createElement(React.Fragment, null, children),
		useSuperwall: () => ({
			subscriptionStatus: { status: "UNKNOWN" },
			setSubscriptionStatus: asyncNoop,
			dismiss: asyncNoop,
		}),
		useUser: () => ({
			user: null,
			subscriptionStatus: { status: "UNKNOWN" },
			identify: asyncNoop,
			update: asyncNoop,
			signOut: asyncNoop,
			setIntegrationAttributes: asyncNoop,
		}),
		usePlacement: () => ({
			registerPlacement: jest.fn().mockResolvedValue(undefined),
			state: { status: "idle" },
		}),
		useSuperwallEvents: jest.fn(),
	};
	// virtual: o pacote só expõe a condição "import" (ESM) no campo `exports`,
	// então o resolver CommonJS do Jest não consegue localizá-lo. Como o módulo
	// é totalmente mockado aqui, marcamos como virtual para dispensar a resolução.
}, { virtual: true });
