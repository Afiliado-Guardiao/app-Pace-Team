import React from "react";

import { fireEvent, render } from "@testing-library/react-native";

import { BackButton } from "../BackButton";

jest.mock("expo-haptics", () => ({
	impactAsync: jest.fn(),
	ImpactFeedbackStyle: { Heavy: "heavy" },
}));

jest.mock("phosphor-react-native", () => ({
	CaretLeftIcon: "View",
}));

jest.mock("@/theme", () => ({
	useTheme: () => ({
		theme: require("@/__tests__/helpers/mockTheme").mockTheme,
	}),
}));

describe("BackButton", () => {
	it("renders without crashing", () => {
		const onPress = jest.fn();
		const { getByTestId } = render(<BackButton onPress={onPress} disabled={false} />);

		expect(getByTestId("btn-back")).toBeTruthy();
	});

	it("calls onPress when pressed", () => {
		const onPress = jest.fn();
		const { getByTestId } = render(<BackButton onPress={onPress} disabled={false} />);

		fireEvent.press(getByTestId("btn-back"));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	it("does not call onPress when disabled", () => {
		const onPress = jest.fn();
		const { getByTestId } = render(<BackButton onPress={onPress} disabled={true} />);

		fireEvent.press(getByTestId("btn-back"));

		expect(onPress).not.toHaveBeenCalled();
	});

	it("has accessibilityLabel", () => {
		const onPress = jest.fn();
		const { getByLabelText } = render(<BackButton onPress={onPress} disabled={false} />);

		expect(getByLabelText("Go back")).toBeTruthy();
	});
});
