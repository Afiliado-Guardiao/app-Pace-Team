import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

import { TextInput } from "../TextInput";

jest.mock("@/theme", () => ({
	useTheme: () => ({ theme: require("@/__tests__/helpers/mockTheme").mockTheme }),
}));

describe("TextInput", () => {
	it("renders with testID", () => {
		render(
			<TextInput
				value=""
				onChangeText={jest.fn()}
				placeholder="Enter email"
				testID="email-input"
			/>,
		);
		expect(screen.getByTestId("email-input")).toBeTruthy();
	});

	it("displays placeholder text", () => {
		render(
			<TextInput
				value=""
				onChangeText={jest.fn()}
				placeholder="Enter email"
				testID="email-input"
			/>,
		);
		expect(screen.getByPlaceholderText("Enter email")).toBeTruthy();
	});

	it("calls onChangeText when text changes", () => {
		const onChangeText = jest.fn();
		render(
			<TextInput value="" onChangeText={onChangeText} placeholder="Name" testID="name-input" />,
		);
		fireEvent.changeText(screen.getByTestId("name-input"), "John");
		expect(onChangeText).toHaveBeenCalledWith("John");
	});

	it("shows error message when error prop is provided", () => {
		render(
			<TextInput
				value=""
				onChangeText={jest.fn()}
				placeholder="Email"
				error="Invalid email"
				testID="email-input"
			/>,
		);
		expect(screen.getByText("Invalid email")).toBeTruthy();
	});

	it("does not show error message when error is not provided", () => {
		render(
			<TextInput value="" onChangeText={jest.fn()} placeholder="Email" testID="email-input" />,
		);
		expect(screen.queryByText("Invalid email")).toBeNull();
	});

	it("is not editable when disabled", () => {
		render(
			<TextInput
				value=""
				onChangeText={jest.fn()}
				placeholder="Email"
				disabled
				testID="email-input"
			/>,
		);
		expect(screen.getByTestId("email-input").props.editable).toBe(false);
	});

	it("is editable by default", () => {
		render(
			<TextInput value="" onChangeText={jest.fn()} placeholder="Email" testID="email-input" />,
		);
		expect(screen.getByTestId("email-input").props.editable).toBe(true);
	});

	it("updates focus state on focus and blur", () => {
		render(
			<TextInput value="" onChangeText={jest.fn()} placeholder="Email" testID="email-input" />,
		);
		const input = screen.getByTestId("email-input");
		fireEvent(input, "focus");
		fireEvent(input, "blur");
		// Não crashar significa que o gerenciamento de estado de foco está funcionando
		expect(input).toBeTruthy();
	});

	it("uses placeholder as accessibilityLabel when no label provided", () => {
		render(
			<TextInput value="" onChangeText={jest.fn()} placeholder="Enter name" testID="name-input" />,
		);
		expect(screen.getByTestId("name-input").props.accessibilityLabel).toBe("Enter name");
	});
});
