import React from "react";
import { fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react-native";

import { ModalProvider } from "../ModalProvider";
import { useModal } from "../hooks/useModal";

jest.mock("@/theme", () => {
	const actual = jest.requireActual("@/theme") as Record<string, unknown>;
	const getTheme = actual.getTheme as () => unknown;
	return { ...actual, useTheme: () => ({ theme: getTheme() }) };
});

jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (k: string) => k }) }));

const wrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => (
	<ModalProvider>{children}</ModalProvider>
);

describe("useModal", () => {
	describe("confirm", () => {
		it("resolves true when confirm button is pressed", async () => {
			const { result } = renderHook(() => useModal(), { wrapper });

			let resolved: boolean | undefined;
			void result.current.confirm({ title: "Are you sure?" }).then((v) => {
				resolved = v;
			});

			await waitFor(() => screen.getByTestId("modal-confirm-ok"));

			fireEvent.press(screen.getByTestId("modal-confirm-ok"));

			await waitFor(() => expect(resolved).toBe(true));
		});

		it("resolves false when cancel button is pressed", async () => {
			const { result } = renderHook(() => useModal(), { wrapper });

			let resolved: boolean | undefined;
			void result.current.confirm({ title: "Are you sure?" }).then((v) => {
				resolved = v;
			});

			await waitFor(() => screen.getByTestId("modal-confirm-cancel"));

			fireEvent.press(screen.getByTestId("modal-confirm-cancel"));

			await waitFor(() => expect(resolved).toBe(false));
		});

		it("resolves false when backdrop is pressed and dismissOnBackdrop is not false", async () => {
			const { result } = renderHook(() => useModal(), { wrapper });

			let resolved: boolean | undefined;
			void result.current.confirm({ title: "Dismiss me" }).then((v) => {
				resolved = v;
			});

			await waitFor(() => screen.getByTestId("modal-backdrop"));

			fireEvent.press(screen.getByTestId("modal-backdrop"));

			await waitFor(() => expect(resolved).toBe(false));
		});
	});

	describe("input", () => {
		it("resolves string value when confirmed", async () => {
			const { result } = renderHook(() => useModal(), { wrapper });

			let resolved: string | null | undefined;
			void result.current.input({ title: "Enter value" }).then((v) => {
				resolved = v;
			});

			await waitFor(() => screen.getByTestId("modal-input-field"));

			fireEvent.changeText(screen.getByTestId("modal-input-field"), "hello");
			fireEvent.press(screen.getByTestId("modal-input-ok"));

			await waitFor(() => expect(resolved).toBe("hello"));
		});

		it("resolves null when cancel is pressed", async () => {
			const { result } = renderHook(() => useModal(), { wrapper });

			let resolved: string | null | undefined;
			void result.current.input({ title: "Enter value" }).then((v) => {
				resolved = v;
			});

			await waitFor(() => screen.getByTestId("modal-input-cancel"));

			fireEvent.press(screen.getByTestId("modal-input-cancel"));

			await waitFor(() => expect(resolved).toBeNull());
		});

		it("resolves null when backdrop is pressed", async () => {
			const { result } = renderHook(() => useModal(), { wrapper });

			let resolved: string | null | undefined;
			void result.current.input({ title: "Enter value" }).then((v) => {
				resolved = v;
			});

			await waitFor(() => screen.getByTestId("modal-backdrop"));

			fireEvent.press(screen.getByTestId("modal-backdrop"));

			await waitFor(() => expect(resolved).toBeNull());
		});

		it("shows error and keeps modal open when validation fails", async () => {
			const { result } = renderHook(() => useModal(), { wrapper });

			let resolved: string | null | undefined;
			void result.current
				.input({
					title: "Enter code",
					validation: (v) => (v.length < 3 ? "too short" : null),
				})
				.then((v) => {
					resolved = v;
				});

			await waitFor(() => screen.getByTestId("modal-input-field"));

			fireEvent.changeText(screen.getByTestId("modal-input-field"), "ab");
			fireEvent.press(screen.getByTestId("modal-input-ok"));

			await waitFor(() => screen.getByTestId("modal-input-error"));
			expect(screen.getByTestId("modal-input-error")).toBeTruthy();
			expect(resolved).toBeUndefined();
		});

		it("resolves after fixing a validation error", async () => {
			const { result } = renderHook(() => useModal(), { wrapper });

			let resolved: string | null | undefined;
			void result.current
				.input({
					title: "Enter code",
					validation: (v) => (v.length < 3 ? "too short" : null),
				})
				.then((v) => {
					resolved = v;
				});

			await waitFor(() => screen.getByTestId("modal-input-field"));

			fireEvent.changeText(screen.getByTestId("modal-input-field"), "ab");
			fireEvent.press(screen.getByTestId("modal-input-ok"));

			await waitFor(() => screen.getByTestId("modal-input-error"));

			fireEvent.changeText(screen.getByTestId("modal-input-field"), "abc");
			fireEvent.press(screen.getByTestId("modal-input-ok"));

			await waitFor(() => expect(resolved).toBe("abc"));
		});
	});

	describe("alert", () => {
		it("resolves undefined after dismiss", async () => {
			const { result } = renderHook(() => useModal(), { wrapper });

			let resolved = false;
			void result.current.alert({ title: "Done!" }).then(() => {
				resolved = true;
			});

			await waitFor(() => screen.getByTestId("modal-alert-ok"));

			fireEvent.press(screen.getByTestId("modal-alert-ok"));

			await waitFor(() => expect(resolved).toBe(true));
		});
	});

	describe("close", () => {
		it("closes without resolving the pending promise", async () => {
			const { result } = renderHook(() => useModal(), { wrapper });

			let resolved = false;
			void result.current.confirm({ title: "Confirm?" }).then(() => {
				resolved = true;
			});

			await waitFor(() => screen.getByTestId("modal-confirm-ok"));

			result.current.close();

			await waitFor(() => expect(screen.queryByTestId("modal-confirm-ok")).toBeNull());
			expect(resolved).toBe(false);
		});
	});

	describe("portal/queue", () => {
		it("shows next queued modal after closing the active one", async () => {
			const { result } = renderHook(() => useModal(), { wrapper });

			void result.current.confirm({ title: "First" });
			void result.current.alert({ title: "Second" });

			await waitFor(() => screen.getByTestId("modal-confirm-ok"));

			fireEvent.press(screen.getByTestId("modal-confirm-ok"));

			await waitFor(() => screen.getByTestId("modal-alert-ok"));
			expect(screen.getByTestId("modal-alert-ok")).toBeTruthy();
		});
	});
});
