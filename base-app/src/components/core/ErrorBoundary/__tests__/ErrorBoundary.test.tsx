import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Text } from "react-native";

import { ErrorBoundary } from "../index";

// Suprime console.error dos logs esperados do error boundary
const originalConsoleError = console.error;
beforeAll(() => {
	console.error = (...args: unknown[]) => {
		const msg = args[0];
		if (
			typeof msg === "string" &&
			(msg.includes("The above error occurred") || msg.includes("ErrorBoundary"))
		) {
			return;
		}
		originalConsoleError(...args);
	};
});
afterAll(() => {
	console.error = originalConsoleError;
});

const ThrowingChild: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = false }) => {
	if (shouldThrow) {
		throw new Error("test error message");
	}
	return <Text testID="child-content">children rendered</Text>;
};

describe("ErrorBoundary", () => {
	it("renders children when there is no error", () => {
		const { getByTestId } = render(
			<ErrorBoundary>
				<ThrowingChild shouldThrow={false} />
			</ErrorBoundary>,
		);

		expect(getByTestId("child-content")).toBeTruthy();
	});

	it("renders fallback with reset button when a child throws", () => {
		const { getByTestId, getByText } = render(
			<ErrorBoundary>
				<ThrowingChild shouldThrow={true} />
			</ErrorBoundary>,
		);

		expect(getByTestId("btn-error-reset")).toBeTruthy();
		expect(getByText("test error message")).toBeTruthy();
	});

	it("resets internal error state when reset button is pressed", () => {
		let shouldThrow = true;
		const ControlledChild: React.FC = () => {
			if (shouldThrow) {
				throw new Error("controlled error");
			}
			return <Text testID="recovered-content">recovered</Text>;
		};

		const { getByTestId, queryByTestId } = render(
			<ErrorBoundary>
				<ControlledChild />
			</ErrorBoundary>,
		);

		// Fallback é exibido depois que o filho lança erro
		expect(getByTestId("btn-error-reset")).toBeTruthy();

		// Para de lançar erro pra que o próximo render mostre os children
		shouldThrow = false;
		fireEvent.press(getByTestId("btn-error-reset"));

		expect(queryByTestId("btn-error-reset")).toBeNull();
		expect(getByTestId("recovered-content")).toBeTruthy();
	});
});
