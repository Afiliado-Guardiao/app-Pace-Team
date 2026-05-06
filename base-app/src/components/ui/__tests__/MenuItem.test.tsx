import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

import { MenuItem } from "../MenuItem";

jest.mock("@/theme", () => ({
	useTheme: () => ({ theme: require("@/__tests__/helpers/mockTheme").mockTheme }),
}));

jest.mock("phosphor-react-native", () => ({
	CaretRightIcon: () => null,
}));

const MockIcon = () => null;
MockIcon.displayName = "MockIcon";

describe("MenuItem", () => {
	it("renders label", () => {
		render(
			<MenuItem icon={MockIcon as never} label="Settings" onPress={jest.fn()} testID="menu-item" />,
		);
		expect(screen.getByText("Settings")).toBeTruthy();
	});

	it("calls onPress when pressed", () => {
		const onPress = jest.fn();
		render(
			<MenuItem icon={MockIcon as never} label="Settings" onPress={onPress} testID="menu-item" />,
		);
		fireEvent.press(screen.getByTestId("menu-item"));
		expect(onPress).toHaveBeenCalledTimes(1);
	});

	it("uses label as default accessibilityLabel", () => {
		render(
			<MenuItem icon={MockIcon as never} label="Profile" onPress={jest.fn()} testID="menu-item" />,
		);
		expect(screen.getByTestId("menu-item").props.accessibilityLabel).toBe("Profile");
	});

	it("uses custom accessibilityLabel when provided", () => {
		render(
			<MenuItem
				icon={MockIcon as never}
				label="Profile"
				onPress={jest.fn()}
				accessibilityLabel="Go to profile"
				testID="menu-item"
			/>,
		);
		expect(screen.getByTestId("menu-item").props.accessibilityLabel).toBe("Go to profile");
	});

	it("renders without testID when not provided", () => {
		const { toJSON } = render(
			<MenuItem icon={MockIcon as never} label="Settings" onPress={jest.fn()} />,
		);
		expect(toJSON()).toBeTruthy();
	});
});
