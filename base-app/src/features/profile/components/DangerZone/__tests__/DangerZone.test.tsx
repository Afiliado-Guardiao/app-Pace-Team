import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { DangerZone } from "../index";

jest.mock("@/theme", () => {
	const actual = jest.requireActual("@/theme") as Record<string, unknown>;
	const getTheme = actual.getTheme as () => unknown;
	return { ...actual, useTheme: () => ({ theme: getTheme() }) };
});

jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (k: string) => k }) }));

jest.mock("phosphor-react-native", () => ({
	SignOutIcon: () => null,
	TrashIcon: () => null,
	WarningIcon: () => null,
}));

describe("DangerZone", () => {
	const onLogout = jest.fn();
	const onDeleteAccount = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders logout and delete account buttons", () => {
		const { getByTestId } = render(
			<DangerZone onLogout={onLogout} onDeleteAccount={onDeleteAccount} />,
		);

		expect(getByTestId("btn-logout")).toBeTruthy();
		expect(getByTestId("btn-delete-account")).toBeTruthy();
	});

	it("calls onLogout when logout button is pressed", () => {
		const { getByTestId } = render(
			<DangerZone onLogout={onLogout} onDeleteAccount={onDeleteAccount} />,
		);

		fireEvent.press(getByTestId("btn-logout"));

		expect(onLogout).toHaveBeenCalledTimes(1);
	});

	it("calls onDeleteAccount when delete button is pressed", () => {
		const { getByTestId } = render(
			<DangerZone onLogout={onLogout} onDeleteAccount={onDeleteAccount} />,
		);

		fireEvent.press(getByTestId("btn-delete-account"));

		expect(onDeleteAccount).toHaveBeenCalledTimes(1);
	});

	it("does not call onLogout when it is not pressed", () => {
		render(<DangerZone onLogout={onLogout} onDeleteAccount={onDeleteAccount} />);

		expect(onLogout).not.toHaveBeenCalled();
	});

	it("does not call onDeleteAccount when it is not pressed", () => {
		render(<DangerZone onLogout={onLogout} onDeleteAccount={onDeleteAccount} />);

		expect(onDeleteAccount).not.toHaveBeenCalled();
	});
});
