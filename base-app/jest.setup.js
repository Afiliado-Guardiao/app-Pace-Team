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
			requireSubscription: jest.fn().mockResolvedValue(false),
			requireSubscriptionWithCampaign: jest.fn().mockResolvedValue(false),
			gateContent: jest.fn().mockResolvedValue(null),
			gateContentWithCampaign: jest.fn().mockResolvedValue(null),
			presentPaywall: jest.fn().mockResolvedValue({
				presented: false,
				purchased: false,
				cancelled: true,
				restored: false,
			}),
			presentCampaign: jest.fn().mockResolvedValue({
				presented: false,
				purchased: false,
				cancelled: true,
				restored: false,
			}),
			preloadCampaign: jest.fn().mockResolvedValue({ success: true }),
			requestPushPermission: jest.fn().mockResolvedValue("notDetermined"),
			onboardingStep: asyncNoop,
		},
		usePaywallo: () => ({
			isInitialized: true,
			isReady: true,
			distinctId: "test-distinct-id",
			subscription: null,
			products: new Map(),
			isLoadingProducts: false,
			presentPaywall: jest.fn().mockResolvedValue({ presented: false, purchased: false }),
			presentCampaign: jest.fn().mockResolvedValue({ presented: false, purchased: false }),
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
			drop: asyncNoop,
		}),
	};
});
