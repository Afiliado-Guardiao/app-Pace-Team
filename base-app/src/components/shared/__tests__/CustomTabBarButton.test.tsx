import React from "react";
import { Text } from "react-native";

import { fireEvent, render } from "@testing-library/react-native";

import { CustomTabBarButton } from "../CustomTabBarButton";

jest.mock("@/theme", () => ({
	useTheme: () => ({
		theme: {
			colors: {
				text: "#000000",
				background: "#FFFFFF",
				surface: "#F0F0F0",
				border: "#E5E5E5",
				primary: "#000000",
				secondary: "#666666",
				overlay: "rgba(0,0,0,0.5)",
			},
			componentSizes: {
				icon: { sm: 28, md: 32, lg: 36 },
				button: { sm: 48, md: 56 },
				tabBar: { height: 90, paddingTop: 13, iconSize: 32 },
			},
			spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
			borderRadius: { sm: 4, md: 8, lg: 16 },
			opacity: { pressed: 0.7, disabled: 0.4 },
		},
	}),
}));

describe("CustomTabBarButton", () => {
	it("renders without crashing", () => {
		const { getByText } = render(
			<CustomTabBarButton>
				<Text>Tab</Text>
			</CustomTabBarButton>,
		);

		expect(getByText("Tab")).toBeTruthy();
	});

	it("renders children", () => {
		const { getByText } = render(
			<CustomTabBarButton>
				<Text testID="child-text">Home</Text>
			</CustomTabBarButton>,
		);

		expect(getByText("Home")).toBeTruthy();
	});

	it("calls onPress when pressed", () => {
		const onPress = jest.fn();
		const { getByText } = render(
			<CustomTabBarButton onPress={onPress}>
				<Text>Tab</Text>
			</CustomTabBarButton>,
		);

		fireEvent.press(getByText("Tab"));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	it("passes through PressableProps", () => {
		const testAccessibilityLabel = "home tab";
		const { getByLabelText } = render(
			<CustomTabBarButton accessibilityLabel={testAccessibilityLabel}>
				<Text>Tab</Text>
			</CustomTabBarButton>,
		);

		expect(getByLabelText(testAccessibilityLabel)).toBeTruthy();
	});
});
