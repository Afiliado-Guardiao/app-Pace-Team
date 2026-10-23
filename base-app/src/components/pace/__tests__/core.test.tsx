import React from "react";
import { Text } from "react-native";

import { fireEvent, render, screen } from "@testing-library/react-native";

import { Avatar, AvatarStack, Badge, Button, Chip, CountUp, Icon, IconButton, Logo } from "../core";

// Com "reduzir movimento", números e arcos vão direto ao valor final
jest.mock("react-native-reanimated", () => {
	const actual = jest.requireActual<Record<string, unknown>>("react-native-reanimated");
	return { __esModule: true, ...actual, default: actual.default, useReducedMotion: () => true };
});

jest.mock("@/theme", () => ({
	useTheme: () => ({ theme: require("@/__tests__/helpers/mockTheme").mockTheme }),
}));

describe("PACE core", () => {
	it("Button renders its label and fires onPress", () => {
		const onPress = jest.fn();
		render(
			<Button onPress={onPress} icon="play" testID="start">
				Começar corrida
			</Button>,
		);
		expect(screen.getByText("Começar corrida")).toBeTruthy();
		expect(screen.getByTestId("start").props.accessibilityLabel).toBe("Começar corrida");
		fireEvent.press(screen.getByTestId("start"));
		expect(onPress).toHaveBeenCalledTimes(1);
	});

	it("Button does not fire when disabled", () => {
		const onPress = jest.fn();
		render(
			<Button onPress={onPress} disabled testID="start">
				Entrar
			</Button>,
		);
		fireEvent.press(screen.getByTestId("start"));
		expect(onPress).not.toHaveBeenCalled();
	});

	it.each(["primary", "glass", "outline", "ghost", "light"] as const)(
		"Button renders variant %s",
		(variant) => {
			render(
				<Button variant={variant} testID="b">
					Label
				</Button>,
			);
			expect(screen.getByTestId("b")).toBeTruthy();
		},
	);

	it("IconButton exposes its label to screen readers", () => {
		const onPress = jest.fn();
		render(<IconButton icon="bell" label="Notificações" badge onPress={onPress} testID="bell" />);
		expect(screen.getByLabelText("Notificações")).toBeTruthy();
		fireEvent.press(screen.getByTestId("bell"));
		expect(onPress).toHaveBeenCalledTimes(1);
	});

	it("Chip reports its selected state", () => {
		render(
			<Chip selected testID="chip">
				Semana
			</Chip>,
		);
		expect(screen.getByTestId("chip").props.accessibilityState).toEqual({ selected: true });
	});

	it("Avatar falls back to initials", () => {
		render(<Avatar name="Lucas Moreira" />);
		expect(screen.getByText("LM")).toBeTruthy();
	});

	it("AvatarStack shows the remaining count", () => {
		render(<AvatarStack people={[{ name: "Ana" }, { name: "Bia" }]} max={1} />);
		expect(screen.getByText("1+")).toBeTruthy();
	});

	it("Badge renders its text", () => {
		render(<Badge tone="success">Validada</Badge>);
		expect(screen.getByText("Validada")).toBeTruthy();
	});

	it("Icon returns null for unknown names", () => {
		const { toJSON } = render(<Icon name="does-not-exist" />);
		expect(toJSON()).toBeNull();
	});

	it("Logo is labelled PACE TEAM", () => {
		render(<Logo />);
		expect(screen.getByLabelText("PACE TEAM")).toBeTruthy();
	});

	it("CountUp keeps non-numeric values as they are", () => {
		render(
			<Text>
				<CountUp value={"5'12\""} />
			</Text>,
		);
		expect(screen.getByText("5'12\"")).toBeTruthy();
	});
});
