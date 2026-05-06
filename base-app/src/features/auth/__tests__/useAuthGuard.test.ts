import { renderHook } from "@testing-library/react-native";

import { useRouter } from "expo-router";

import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

import { useAuthGuard } from "../hooks/useAuthGuard";

jest.mock("expo-router", () => ({
	useRouter: jest.fn(),
	useSegments: jest.fn(() => []),
	usePathname: jest.fn(() => "/"),
}));

jest.mock("@/store", () => ({
	useStore: jest.fn(),
}));

const mockUseStore = useStore as jest.MockedFunction<typeof useStore>;

describe("useAuthGuard", () => {
	const mockReplace = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		(useRouter as jest.Mock).mockReturnValue({
			push: jest.fn(),
			replace: mockReplace,
			back: jest.fn(),
		});
	});

	function setupStore(isAuthenticated: boolean, hasHydrated: boolean) {
		mockUseStore.mockImplementation((selector: (state: unknown) => unknown) => {
			const state = { isAuthenticated, _hasHydrated: hasHydrated };
			return selector(state);
		});
	}

	it("should return shouldRender=false when store has not hydrated yet", () => {
		setupStore(true, false);

		const { result } = renderHook(() => useAuthGuard());

		expect(result.current.shouldRender).toBe(false);
	});

	it("should return shouldRender=false when unauthenticated after hydration", () => {
		setupStore(false, true);

		const { result } = renderHook(() => useAuthGuard());

		expect(result.current.shouldRender).toBe(false);
	});

	it("should return shouldRender=true when authenticated and hydrated", () => {
		setupStore(true, true);

		const { result } = renderHook(() => useAuthGuard());

		expect(result.current.shouldRender).toBe(true);
	});

	it("should redirect to AUTH route when unauthenticated and hydrated", () => {
		setupStore(false, true);

		renderHook(() => useAuthGuard());

		expect(mockReplace).toHaveBeenCalledWith(ROUTES.AUTH);
	});

	it("should not redirect when authenticated and hydrated", () => {
		setupStore(true, true);

		renderHook(() => useAuthGuard());

		expect(mockReplace).not.toHaveBeenCalled();
	});

	it("should not redirect when store has not hydrated yet", () => {
		setupStore(false, false);

		renderHook(() => useAuthGuard());

		expect(mockReplace).not.toHaveBeenCalled();
	});
});
