import React from "react";

import { fireEvent, render, screen } from "@testing-library/react-native";

import { Checkbox, Input, Radio, SegmentedControl, Select, Switch } from "../forms";

// Com "reduzir movimento", números e arcos vão direto ao valor final
jest.mock("react-native-reanimated", () => {
	const actual = jest.requireActual<Record<string, unknown>>("react-native-reanimated");
	return { __esModule: true, ...actual, default: actual.default, useReducedMotion: () => true };
});

jest.mock("@/theme", () => ({
	useTheme: () => ({ theme: require("@/__tests__/helpers/mockTheme").mockTheme }),
}));

describe("PACE forms", () => {
	it("Checkbox toggles uncontrolled and reports the new value", () => {
		const onChange = jest.fn();
		render(<Checkbox label="Aceito os termos" onChange={onChange} testID="terms" />);
		fireEvent.press(screen.getByTestId("terms"));
		expect(onChange).toHaveBeenCalledWith(true);
		expect(screen.getByTestId("terms").props.accessibilityState).toMatchObject({ checked: true });
	});

	it("Checkbox ignores presses when disabled", () => {
		const onChange = jest.fn();
		render(<Checkbox label="x" disabled onChange={onChange} testID="c" />);
		fireEvent.press(screen.getByTestId("c"));
		expect(onChange).not.toHaveBeenCalled();
	});

	it("Switch respects the controlled value", () => {
		const onChange = jest.fn();
		render(<Switch label="Modo escuro" checked={false} onChange={onChange} testID="sw" />);
		fireEvent.press(screen.getByTestId("sw"));
		expect(onChange).toHaveBeenCalledWith(true);
		expect(screen.getByTestId("sw").props.accessibilityState).toMatchObject({ checked: false });
	});

	it("Radio calls onChange with true", () => {
		const onChange = jest.fn();
		render(<Radio label="5x5" onChange={onChange} testID="r" />);
		fireEvent.press(screen.getByTestId("r"));
		expect(onChange).toHaveBeenCalledWith(true);
	});

	it("Input shows the error and passes typed text", () => {
		const onChangeText = jest.fn();
		render(
			<Input label="E-mail" error="E-mail inválido" onChangeText={onChangeText} testID="mail" />,
		);
		expect(screen.getByText("E-mail inválido")).toBeTruthy();
		fireEvent.changeText(screen.getByTestId("mail"), "a@b.com");
		expect(onChangeText).toHaveBeenCalledWith("a@b.com");
	});

	it("Input password can be revealed", () => {
		render(<Input label="Senha" type="password" testID="pw" />);
		expect(screen.getByTestId("pw").props.secureTextEntry).toBe(true);
		fireEvent.press(screen.getByTestId("pw-reveal"));
		expect(screen.getByTestId("pw").props.secureTextEntry).toBe(false);
	});

	it("SegmentedControl selects an option", () => {
		const onChange = jest.fn();
		render(
			<SegmentedControl
				options={["Cidade", "Estado"]}
				value="Cidade"
				onChange={onChange}
				testID="seg"
			/>,
		);
		fireEvent.press(screen.getByTestId("seg-Estado"));
		expect(onChange).toHaveBeenCalledWith("Estado");
	});

	it("Select opens the options sheet and picks a value", () => {
		const onChange = jest.fn();
		render(
			<Select
				label="Cidade"
				options={["Campinas", "Valinhos"]}
				defaultValue="Campinas"
				onChange={onChange}
				testID="city"
			/>,
		);
		expect(screen.getByText("Campinas")).toBeTruthy();
		fireEvent.press(screen.getByTestId("city"));
		fireEvent.press(screen.getByTestId("city-option-Valinhos"));
		expect(onChange).toHaveBeenCalledWith("Valinhos");
		expect(screen.queryByTestId("city-sheet")).toBeNull();
	});
});
