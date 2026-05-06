import { renderHook } from "@testing-library/react-native";
import { act } from "react";

import { useRouter } from "expo-router";

import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

import { useAuthBack } from "../hooks/useAuthBack";

jest.mock("expo-router", () => ({
	useRouter: jest.fn(),
	useSegments: jest.fn(() => []),
	usePathname: jest.fn(() => "/"),
}));

jest.mock("@/store", () => ({
	useStore: jest.fn(),
}));

const mockUseStore = useStore as jest.MockedFunction<typeof useStore>;

describe("useAuthBack", () => {
	const mockPush = jest.fn();
	const mockSetCompleted = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		(useRouter as jest.Mock).mockReturnValue({
			push: mockPush,
			replace: jest.fn(),
			back: jest.fn(),
		});
		mockUseStore.mockImplementation((selector: (state: unknown) => unknown) => {
			const state = { setCompleted: mockSetCompleted };
			return selector(state);
		});
	});

	it("should return handleBack function", () => {
		const { result } = renderHook(() => useAuthBack());

		expect(typeof result.current.handleBack).toBe("function");
	});

	it("should call setCompleted(false) when handleBack is called", () => {
		const { result } = renderHook(() => useAuthBack());

		act(() => {
			result.current.handleBack();
		});

		expect(mockSetCompleted).toHaveBeenCalledWith(false);
	});

	it("should navigate to ONBOARDING route when handleBack is called", () => {
		const { result } = renderHook(() => useAuthBack());

		act(() => {
			result.current.handleBack();
		});

		expect(mockPush).toHaveBeenCalledWith(ROUTES.ONBOARDING);
	});

	it("should call setCompleted before navigating", () => {
		const callOrder: string[] = [];
		mockSetCompleted.mockImplementation(() => callOrder.push("setCompleted"));
		mockPush.mockImplementation(() => callOrder.push("push"));

		const { result } = renderHook(() => useAuthBack());

		act(() => {
			result.current.handleBack();
		});

		expect(callOrder).toEqual(["setCompleted", "push"]);
	});
});
