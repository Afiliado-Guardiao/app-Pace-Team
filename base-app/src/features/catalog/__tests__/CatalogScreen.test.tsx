import React from "react";

import { fireEvent, render, screen } from "@testing-library/react-native";

import { CatalogScreen } from "../index";

const mockBack = jest.fn();
const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
	useRouter: () => ({ back: mockBack, replace: mockReplace, canGoBack: () => true }),
}));

jest.mock("react-native-safe-area-context", () => ({
	useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("react-native-reanimated", () => {
	const actual = jest.requireActual<Record<string, unknown>>("react-native-reanimated");
	return { __esModule: true, ...actual, default: actual.default, useReducedMotion: () => true };
});

jest.mock("@/theme", () => ({
	useTheme: () => ({ theme: require("@/__tests__/helpers/mockTheme").mockTheme }),
}));

describe("CatalogScreen", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders every showcase section", () => {
		render(<CatalogScreen />);
		["Botões", "Campos", "Cards de vidro", "Pódio", "Ranking", "Navegação"].forEach((title) => {
			expect(screen.getAllByText(title).length).toBeGreaterThan(0);
		});
	});

	it("opens and closes the bottom sheet", () => {
		render(<CatalogScreen />);
		fireEvent.press(screen.getByLabelText("Finalizar corrida"));
		expect(screen.getByText("Finalizar corrida?")).toBeTruthy();
		fireEvent.press(screen.getByLabelText("Continuar correndo"));
		expect(screen.queryByText("Finalizar corrida?")).toBeNull();
	});

	it("selects a chip", () => {
		render(<CatalogScreen />);
		fireEvent.press(screen.getByLabelText("Mês"));
		expect(screen.getByLabelText("Mês").props.accessibilityState).toEqual({ selected: true });
	});

	it("goes back from the header", () => {
		render(<CatalogScreen />);
		fireEvent.press(screen.getAllByLabelText("Voltar")[0]);
		expect(mockBack).toHaveBeenCalledTimes(1);
	});
});
