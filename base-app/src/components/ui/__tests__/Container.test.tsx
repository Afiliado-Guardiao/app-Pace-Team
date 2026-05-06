import React from "react";
import { Text } from "react-native";
import { render, screen } from "@testing-library/react-native";

import { Container } from "../Container";

jest.mock("@/theme", () => ({
	useTheme: () => ({
		theme: {
			colors: {
				text: "#000",
				textSecondary: "#666",
				background: "#fff",
				surface: "#f5f5f5",
				border: "#ddd",
				primary: "#007AFF",
				error: "#FF3B30",
				white: "#fff",
				black: "#000",
				textTertiary: "#999",
				transparent: "transparent",
				success: "#34C759",
				warning: "#FF9500",
			},
			spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
			borderRadius: { xs: 4, sm: 8, md: 12, lg: 16, full: 999 },
			borderWidth: { thin: 1, medium: 2 },
			typography: {
				body: { fontSize: 16 },
				caption: { fontSize: 12 },
				label: { fontSize: 14 },
				h1: { fontSize: 32 },
				h2: { fontSize: 24 },
				h3: { fontSize: 20 },
				h4: { fontSize: 18 },
			},
			componentSizes: {
				button: {
					sm: { height: 36, paddingHorizontal: 12 },
					md: { height: 44, paddingHorizontal: 16 },
					lg: { height: 52, paddingHorizontal: 24 },
				},
				input: { height: 48 },
			},
			shadows: { sm: {} },
			opacity: { disabled: 0.5 },
		},
	}),
}));

describe("Container", () => {
	it("renders children", () => {
		render(
			<Container>
				<Text>Hello</Text>
			</Container>,
		);
		expect(screen.getByText("Hello")).toBeTruthy();
	});

	it("renders multiple children", () => {
		render(
			<Container>
				<Text>First</Text>
				<Text>Second</Text>
			</Container>,
		);
		expect(screen.getByText("First")).toBeTruthy();
		expect(screen.getByText("Second")).toBeTruthy();
	});

	it("renders without children", () => {
		const { toJSON } = render(<Container />);
		expect(toJSON()).toBeTruthy();
	});
});
