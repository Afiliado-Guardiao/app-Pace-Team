import { renderHook } from "@testing-library/react-native";
import { act } from "react";

import { useRouter } from "expo-router";

import { WELCOME_ROUTES } from "../constants";
import { useWelcomeScreen } from "../hooks/useWelcomeScreen";

jest.mock("expo-router", () => ({
	useRouter: jest.fn(),
	useSegments: jest.fn(() => []),
	usePathname: jest.fn(() => "/"),
}));

describe("useWelcomeScreen", () => {
	const mockPush = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		(useRouter as jest.Mock).mockReturnValue({
			push: mockPush,
			replace: jest.fn(),
			back: jest.fn(),
		});
	});

	it("should return handleStartOnboarding function", () => {
		const { result } = renderHook(() => useWelcomeScreen());

		expect(typeof result.current.handleStartOnboarding).toBe("function");
	});

	it("should navigate to onboarding route when handleStartOnboarding is called", () => {
		const { result } = renderHook(() => useWelcomeScreen());

		act(() => {
			result.current.handleStartOnboarding();
		});

		expect(mockPush).toHaveBeenCalledWith(WELCOME_ROUTES.ONBOARDING);
	});
});
