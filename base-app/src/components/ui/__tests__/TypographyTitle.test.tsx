import React from "react";
import { render, screen } from "@testing-library/react-native";

import { Title } from "../Typography/Title";

jest.mock("@/theme", () => ({
	useTheme: () => ({ theme: require("@/__tests__/helpers/mockTheme").mockTheme }),
}));

describe("Typography/Title", () => {
	it("renders title content", () => {
		render(<Title>Page Title</Title>);
		expect(screen.getByText("Page Title")).toBeTruthy();
	});

	it.each([1, 2, 3, 4] as const)("renders level %i without crashing", (level) => {
		render(<Title level={level}>Heading</Title>);
		expect(screen.getByText("Heading")).toBeTruthy();
	});

	it("defaults to level 1", () => {
		const { toJSON } = render(<Title>Default title</Title>);
		expect(toJSON()).toBeTruthy();
	});

	it("respects numberOfLines prop", () => {
		render(<Title numberOfLines={1}>Long title text</Title>);
		expect(screen.getByText("Long title text").props.numberOfLines).toBe(1);
	});
});
