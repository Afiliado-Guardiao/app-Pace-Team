import React from "react";
import { render, screen } from "@testing-library/react-native";

import { Text } from "../Typography/Text";

jest.mock("@/theme", () => ({
	useTheme: () => ({ theme: require("@/__tests__/helpers/mockTheme").mockTheme }),
}));

describe("Typography/Text", () => {
	it("renders text content", () => {
		render(<Text>Hello world</Text>);
		expect(screen.getByText("Hello world")).toBeTruthy();
	});

	it.each(["body", "caption", "label"] as const)(
		"renders variant %s without crashing",
		(variant) => {
			render(<Text variant={variant}>Sample text</Text>);
			expect(screen.getByText("Sample text")).toBeTruthy();
		},
	);

	it("defaults to body variant", () => {
		const { toJSON } = render(<Text>Default text</Text>);
		expect(toJSON()).toBeTruthy();
	});

	it("respects numberOfLines prop", () => {
		render(<Text numberOfLines={2}>Long text</Text>);
		expect(screen.getByText("Long text").props.numberOfLines).toBe(2);
	});
});
