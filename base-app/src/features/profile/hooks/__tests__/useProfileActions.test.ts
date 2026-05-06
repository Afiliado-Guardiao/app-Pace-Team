import { renderHook } from "@testing-library/react-native";

import { useProfileActions } from "../useProfileActions";

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

const mockInput = jest.fn();
const mockAlert = jest.fn();
const mockConfirm = jest.fn();

jest.mock("@/components/ui/Modal", () => ({
	useModal: () => ({
		input: mockInput,
		alert: mockAlert,
		confirm: mockConfirm,
		close: jest.fn(),
		custom: jest.fn(),
	}),
}));

const mockUpdateMe = jest.fn();
const mockUpdatePassword = jest.fn();
const mockDeleteMe = jest.fn();

jest.mock("@/lib/api/user", () => ({
	updateMe: (...args: unknown[]) => mockUpdateMe(...args),
	updatePassword: (...args: unknown[]) => mockUpdatePassword(...args),
	deleteMe: (...args: unknown[]) => mockDeleteMe(...args),
}));

const mockAuthLogout = jest.fn();

jest.mock("@/lib/api/auth", () => ({
	authApi: {
		logout: (...args: unknown[]) => mockAuthLogout(...args),
	},
}));

jest.mock("@/store", () => ({
	useStore: jest.fn(),
}));

const mockRouterReplace = jest.fn();

jest.mock("expo-router", () => ({
	useRouter: () => ({
		replace: mockRouterReplace,
	}),
}));

// ── Store setup ──────────────────────────────────────────────────────────────

import { useStore } from "@/store";

const mockUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockSetUser = jest.fn();
const mockLogout = jest.fn();

interface IMockState {
	user: { name: string; email: string; birthday: string } | null;
	setUser: jest.Mock;
	logout: jest.Mock;
}

function setupStore(user: IMockState["user"] = null): void {
	const state: IMockState = {
		user,
		setUser: mockSetUser,
		logout: mockLogout,
	};
	mockUseStore.mockImplementation((selector: (s: IMockState) => unknown) => selector(state));
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function flushPromises(): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => setTimeout(resolve, 0));
}

const { waitFor } = require("@testing-library/react-native");

// ── Tests ────────────────────────────────────────────────────────────────────

describe("useProfileActions", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		setupStore({ name: "John", email: "john@example.com", birthday: "1990-01-01" });
		mockInput.mockResolvedValue(null);
		mockAlert.mockResolvedValue(undefined);
		mockConfirm.mockResolvedValue(false);
		mockUpdateMe.mockResolvedValue({ name: "Updated" });
		mockUpdatePassword.mockResolvedValue(undefined);
		mockDeleteMe.mockResolvedValue(undefined);
		mockAuthLogout.mockResolvedValue(undefined);
	});

	// ── editName ──────────────────────────────────────────────────────────────

	describe("editName", () => {
		it("happy path: opens input, calls updateMe with name, updates store", async () => {
			mockInput.mockResolvedValue("New Name");
			const updatedUser = { name: "New Name", email: "john@example.com", birthday: "1990-01-01" };
			mockUpdateMe.mockResolvedValue(updatedUser);

			const { result } = renderHook(() => useProfileActions());
			result.current.editName();

			await waitFor(() => {
				expect(mockUpdateMe).toHaveBeenCalledWith({ name: "New Name" });
			});
			expect(mockSetUser).toHaveBeenCalledWith(updatedUser);
		});

		it("does nothing when input returns null (user cancels)", async () => {
			mockInput.mockResolvedValue(null);

			const { result } = renderHook(() => useProfileActions());
			result.current.editName();

			await flushPromises();
			expect(mockUpdateMe).not.toHaveBeenCalled();
		});

		it("shows error alert when updateMe throws", async () => {
			mockInput.mockResolvedValue("New Name");
			mockUpdateMe.mockRejectedValue(new Error("API error"));

			const { result } = renderHook(() => useProfileActions());
			result.current.editName();

			await waitFor(() => {
				expect(mockAlert).toHaveBeenCalledTimes(1);
			});
			expect(mockSetUser).not.toHaveBeenCalled();
		});
	});

	// ── editEmail ─────────────────────────────────────────────────────────────

	describe("editEmail", () => {
		it("happy path: opens input, calls updateMe with email", async () => {
			mockInput.mockResolvedValue("new@example.com");
			const updatedUser = { name: "John", email: "new@example.com", birthday: "1990-01-01" };
			mockUpdateMe.mockResolvedValue(updatedUser);

			const { result } = renderHook(() => useProfileActions());
			result.current.editEmail();

			await waitFor(() => {
				expect(mockUpdateMe).toHaveBeenCalledWith({ email: "new@example.com" });
			});
			expect(mockSetUser).toHaveBeenCalledWith(updatedUser);
		});

		it("shows error alert when updateMe throws", async () => {
			mockInput.mockResolvedValue("new@example.com");
			mockUpdateMe.mockRejectedValue(new Error("API error"));

			const { result } = renderHook(() => useProfileActions());
			result.current.editEmail();

			await waitFor(() => {
				expect(mockAlert).toHaveBeenCalledTimes(1);
			});
		});
	});

	// ── editBirthday ──────────────────────────────────────────────────────────

	describe("editBirthday", () => {
		it("happy path: opens input, calls updateMe with birthday", async () => {
			mockInput.mockResolvedValue("1995-06-15");
			const updatedUser = { name: "John", email: "john@example.com", birthday: "1995-06-15" };
			mockUpdateMe.mockResolvedValue(updatedUser);

			const { result } = renderHook(() => useProfileActions());
			result.current.editBirthday();

			await waitFor(() => {
				expect(mockUpdateMe).toHaveBeenCalledWith({ birthday: "1995-06-15" });
			});
			expect(mockSetUser).toHaveBeenCalledWith(updatedUser);
		});

		it("shows error alert when updateMe throws", async () => {
			mockInput.mockResolvedValue("1995-06-15");
			mockUpdateMe.mockRejectedValue(new Error("API error"));

			const { result } = renderHook(() => useProfileActions());
			result.current.editBirthday();

			await waitFor(() => {
				expect(mockAlert).toHaveBeenCalledTimes(1);
			});
		});
	});

	// ── editPassword ──────────────────────────────────────────────────────────

	describe("editPassword", () => {
		it("happy path: collects current + new password, calls updatePassword, shows success", async () => {
			mockInput.mockResolvedValueOnce("currentPass123").mockResolvedValueOnce("newPass456");

			const { result } = renderHook(() => useProfileActions());
			result.current.editPassword();

			await waitFor(() => {
				expect(mockUpdatePassword).toHaveBeenCalledWith({
					currentPassword: "currentPass123",
					newPassword: "newPass456",
				});
			});
			expect(mockAlert).toHaveBeenCalledTimes(1);
		});

		it("does nothing when current password input returns null", async () => {
			mockInput.mockResolvedValueOnce(null);

			const { result } = renderHook(() => useProfileActions());
			result.current.editPassword();

			await flushPromises();
			expect(mockUpdatePassword).not.toHaveBeenCalled();
		});

		it("does nothing when new password input returns null", async () => {
			mockInput.mockResolvedValueOnce("currentPass123").mockResolvedValueOnce(null);

			const { result } = renderHook(() => useProfileActions());
			result.current.editPassword();

			await flushPromises();
			expect(mockUpdatePassword).not.toHaveBeenCalled();
		});

		it("shows error alert when updatePassword throws", async () => {
			mockInput.mockResolvedValueOnce("currentPass123").mockResolvedValueOnce("newPass456");
			mockUpdatePassword.mockRejectedValue(new Error("wrong password"));

			const { result } = renderHook(() => useProfileActions());
			result.current.editPassword();

			await waitFor(() => {
				expect(mockAlert).toHaveBeenCalledTimes(1);
			});
		});
	});

	// ── handleLogout ──────────────────────────────────────────────────────────

	describe("handleLogout", () => {
		it("happy path: confirms, calls authApi.logout, clears store, redirects", async () => {
			mockConfirm.mockResolvedValue(true);

			const { result } = renderHook(() => useProfileActions());
			result.current.handleLogout();

			await waitFor(() => {
				expect(mockLogout).toHaveBeenCalled();
				expect(mockRouterReplace).toHaveBeenCalledWith("/(non-auth)/welcome");
			});
			expect(mockAuthLogout).toHaveBeenCalled();
		});

		it("does nothing when user cancels confirm", async () => {
			mockConfirm.mockResolvedValue(false);

			const { result } = renderHook(() => useProfileActions());
			result.current.handleLogout();

			await flushPromises();
			expect(mockLogout).not.toHaveBeenCalled();
			expect(mockRouterReplace).not.toHaveBeenCalled();
		});

		it("still clears store and redirects even when authApi.logout throws", async () => {
			mockConfirm.mockResolvedValue(true);
			mockAuthLogout.mockRejectedValue(new Error("network error"));

			const { result } = renderHook(() => useProfileActions());
			result.current.handleLogout();

			await waitFor(() => {
				expect(mockLogout).toHaveBeenCalled();
				expect(mockRouterReplace).toHaveBeenCalledWith("/(non-auth)/welcome");
			});
		});
	});

	// ── handleDeleteAccount ───────────────────────────────────────────────────

	describe("handleDeleteAccount", () => {
		it("happy path: double confirm, calls deleteMe, clears store, redirects", async () => {
			mockConfirm.mockResolvedValueOnce(true).mockResolvedValueOnce(true);

			const { result } = renderHook(() => useProfileActions());
			result.current.handleDeleteAccount();

			await waitFor(() => {
				expect(mockDeleteMe).toHaveBeenCalled();
				expect(mockLogout).toHaveBeenCalled();
				expect(mockRouterReplace).toHaveBeenCalledWith("/(non-auth)/welcome");
			});
		});

		it("aborts after first confirm is rejected", async () => {
			mockConfirm.mockResolvedValueOnce(false);

			const { result } = renderHook(() => useProfileActions());
			result.current.handleDeleteAccount();

			await flushPromises();
			expect(mockDeleteMe).not.toHaveBeenCalled();
			expect(mockLogout).not.toHaveBeenCalled();
		});

		it("aborts after second confirm is rejected", async () => {
			mockConfirm.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

			const { result } = renderHook(() => useProfileActions());
			result.current.handleDeleteAccount();

			await flushPromises();
			expect(mockDeleteMe).not.toHaveBeenCalled();
			expect(mockLogout).not.toHaveBeenCalled();
		});

		it("still clears store and redirects even when deleteMe throws", async () => {
			mockConfirm.mockResolvedValueOnce(true).mockResolvedValueOnce(true);
			mockDeleteMe.mockRejectedValue(new Error("API error"));

			const { result } = renderHook(() => useProfileActions());
			result.current.handleDeleteAccount();

			await waitFor(() => {
				expect(mockLogout).toHaveBeenCalled();
				expect(mockRouterReplace).toHaveBeenCalledWith("/(non-auth)/welcome");
			});
		});
	});
});
