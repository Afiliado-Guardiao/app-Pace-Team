import React from "react";
import { Text } from "react-native";
import { render, screen } from "@testing-library/react-native";

import { Section } from "../Section";

jest.mock("@/theme", () => ({
	useTheme: () => ({ theme: require("@/__tests__/helpers/mockTheme").mockTheme }),
}));

describe("Section", () => {
	it("renders title", () => {
		render(
			<Section title="Account">
				<Text>Content</Text>
			</Section>,
		);
		expect(screen.getByText("Account")).toBeTruthy();
	});

	it("renders children", () => {
		render(
			<Section title="Account">
				<Text>My content</Text>
			</Section>,
		);
		expect(screen.getByText("My content")).toBeTruthy();
	});

	it("renders multiple children", () => {
		render(
			<Section title="Settings">
				<Text>Item A</Text>
				<Text>Item B</Text>
			</Section>,
		);
		expect(screen.getByText("Item A")).toBeTruthy();
		expect(screen.getByText("Item B")).toBeTruthy();
	});
});
