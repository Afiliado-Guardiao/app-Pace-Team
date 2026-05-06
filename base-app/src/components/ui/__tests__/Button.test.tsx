import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

import { Button } from "../Button";

jest.mock("@/theme", () => ({
	useTheme: () => ({ theme: require("@/__tests__/helpers/mockTheme").mockTheme }),
}));

describe("Button", () => {
	it("renders children text", () => {
		render(
			<Button onPress={jest.fn()} testID="btn">
				Confirm
			</Button>,
		);
		expect(screen.getByText("Confirm")).toBeTruthy();
	});

	it("calls onPress when pressed", () => {
		const onPress = jest.fn();
		render(
			<Button onPress={onPress} testID="btn">
				Go
			</Button>,
		);
		fireEvent.press(screen.getByTestId("btn"));
		expect(onPress).toHaveBeenCalledTimes(1);
	});

	it("does not call onPress when disabled", () => {
		const onPress = jest.fn();
		render(
			<Button onPress={onPress} disabled testID="btn">
				Go
			</Button>,
		);
		fireEvent.press(screen.getByTestId("btn"));
		expect(onPress).not.toHaveBeenCalled();
	});

	it("shows ActivityIndicator when loading", () => {
		render(
			<Button onPress={jest.fn()} loading testID="btn">
				Save
			</Button>,
		);
		expect(screen.queryByText("Save")).toBeNull();
		expect(screen.getByTestId("btn").findByType).toBeDefined();
	});

	it("does not call onPress when loading", () => {
		const onPress = jest.fn();
		render(
			<Button onPress={onPress} loading testID="btn">
				Save
			</Button>,
		);
		fireEvent.press(screen.getByTestId("btn"));
		expect(onPress).not.toHaveBeenCalled();
	});

	it.each(["default", "outline", "ghost", "success", "error", "warning"] as const)(
		"renders variant %s without crashing",
		(variant) => {
			render(
				<Button onPress={jest.fn()} variant={variant} testID="btn">
					Label
				</Button>,
			);
			expect(screen.getByTestId("btn")).toBeTruthy();
		},
	);

	it.each(["sm", "md", "lg"] as const)("renders size %s without crashing", (size) => {
		render(
			<Button onPress={jest.fn()} size={size} testID="btn">
				Label
			</Button>,
		);
		expect(screen.getByTestId("btn")).toBeTruthy();
	});

	it("renders accessibilityLabel", () => {
		render(
			<Button onPress={jest.fn()} accessibilityLabel="Submit form" testID="btn">
				Submit
			</Button>,
		);
		expect(screen.getByTestId("btn").props.accessibilityLabel).toBe("Submit form");
	});
});
