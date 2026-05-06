import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

import { ErrorModal } from "../ErrorModal";

jest.mock("@/theme", () => ({
	useTheme: () => ({ theme: require("@/__tests__/helpers/mockTheme").mockTheme }),
}));

jest.mock("phosphor-react-native", () => ({
	WarningDiamondIcon: () => null,
}));

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

describe("ErrorModal", () => {
	it("renders message when visible", () => {
		render(
			<ErrorModal
				visible={true}
				message="Something went wrong"
				onClose={jest.fn()}
			/>,
		);
		expect(screen.getByText("Something went wrong")).toBeTruthy();
	});

	it("renders title when provided", () => {
		render(
			<ErrorModal
				visible={true}
				title="Error"
				message="Something went wrong"
				onClose={jest.fn()}
			/>,
		);
		expect(screen.getByText("Error")).toBeTruthy();
	});

	it("does not render title when not provided", () => {
		render(
			<ErrorModal
				visible={true}
				message="Something went wrong"
				onClose={jest.fn()}
			/>,
		);
		expect(screen.queryByText("Error")).toBeNull();
	});

	it("renders custom confirmText when provided", () => {
		render(
			<ErrorModal
				visible={true}
				message="An error occurred"
				onClose={jest.fn()}
				confirmText="Got it"
			/>,
		);
		expect(screen.getByText("Got it")).toBeTruthy();
	});

	it("falls back to translated 'ok' when confirmText is not provided", () => {
		render(
			<ErrorModal
				visible={true}
				message="An error occurred"
				onClose={jest.fn()}
			/>,
		);
		expect(screen.getByText("ok")).toBeTruthy();
	});

	it("calls onClose when confirm button is pressed", () => {
		const onClose = jest.fn();
		render(
			<ErrorModal
				visible={true}
				message="An error occurred"
				onClose={onClose}
				confirmText="Close"
			/>,
		);
		fireEvent.press(screen.getByText("Close"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("does not show content when not visible", () => {
		render(
			<ErrorModal
				visible={false}
				message="An error occurred"
				onClose={jest.fn()}
			/>,
		);
		expect(screen.queryByText("An error occurred")).toBeNull();
	});
});
