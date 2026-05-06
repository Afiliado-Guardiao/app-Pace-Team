import React from "react";

import { fireEvent, render } from "@testing-library/react-native";

import { LanguageSwitcher } from "../LanguageSwitcher";

const mockChangeLanguage = jest.fn();
const mockCurrentLanguage = { value: "en-US" as "pt-BR" | "en-US" | "es-ES" };

jest.mock("@/theme", () => ({
	useTheme: () => ({
		theme: require("@/__tests__/helpers/mockTheme").mockTheme,
	}),
}));

jest.mock("@/i18n", () => ({
	useLanguage: () => ({
		currentLanguage: mockCurrentLanguage.value,
		changeLanguage: mockChangeLanguage,
	}),
	SUPPORTED_LOCALES: ["pt-BR", "en-US", "es-ES"],
}));

describe("LanguageSwitcher", () => {
	beforeEach(() => {
		mockChangeLanguage.mockClear();
		mockCurrentLanguage.value = "en-US";
	});

	it("renders without crashing", () => {
		const { getByTestId } = render(<LanguageSwitcher />);

		expect(getByTestId("btn-language-switcher")).toBeTruthy();
	});

	it("shows current language flag and code", () => {
		const { getByText } = render(<LanguageSwitcher />);

		expect(getByText("🇺🇸")).toBeTruthy();
		expect(getByText("EN")).toBeTruthy();
	});

	it("opens modal when button is pressed", () => {
		const { getByTestId } = render(<LanguageSwitcher />);

		fireEvent.press(getByTestId("btn-language-switcher"));

		expect(getByTestId("btn-language-modal-overlay")).toBeTruthy();
	});

	it("shows all language options in modal", () => {
		const { getByTestId, getByText } = render(<LanguageSwitcher />);

		fireEvent.press(getByTestId("btn-language-switcher"));

		expect(getByTestId("btn-language-option-pt-BR")).toBeTruthy();
		expect(getByTestId("btn-language-option-en-US")).toBeTruthy();
		expect(getByTestId("btn-language-option-es-ES")).toBeTruthy();
		expect(getByText("Português")).toBeTruthy();
		expect(getByText("English")).toBeTruthy();
		expect(getByText("Español")).toBeTruthy();
	});

	it("calls changeLanguage when a language option is pressed", () => {
		const { getByTestId } = render(<LanguageSwitcher />);

		fireEvent.press(getByTestId("btn-language-switcher"));
		fireEvent.press(getByTestId("btn-language-option-pt-BR"));

		expect(mockChangeLanguage).toHaveBeenCalledWith("pt-BR");
	});

	it("closes modal when overlay is pressed", () => {
		const { getByTestId, queryByTestId } = render(<LanguageSwitcher />);

		fireEvent.press(getByTestId("btn-language-switcher"));
		expect(getByTestId("btn-language-modal-overlay")).toBeTruthy();

		fireEvent.press(getByTestId("btn-language-modal-overlay"));
		expect(queryByTestId("btn-language-modal-overlay")).toBeFalsy();
	});
});
