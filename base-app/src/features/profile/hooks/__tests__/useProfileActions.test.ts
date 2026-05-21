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

const mockUpdateProfile = jest.fn();
const mockUpdateUserEmail = jest.fn();
const mockUpdateUserPassword = jest.fn();
const mockSignOut = jest.fn();
const mockDeleteAccount = jest.fn();

jest.mock("@/lib/supabase", () => ({
	updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
	updateUserEmail: (...args: unknown[]) => mockUpdateUserEmail(...args),
	updateUserPassword: (...args: unknown[]) => mockUpdateUserPassword(...args),
	signOut: (...args: unknown[]) => mockSignOut(...args),
	deleteAccount: (...args: unknown[]) => mockDeleteAccount(...args),
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

interface IMockState {
	user: { name: string; email: string; birthday: string } | null;
}

function setupStore(user: IMockState["user"] = null): void {
	const state: IMockState = { user };
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
		mockUpdateProfile.mockResolvedValue(undefined);
		mockUpdateUserEmail.mockResolvedValue(undefined);
		mockUpdateUserPassword.mockResolvedValue(undefined);
		mockSignOut.mockResolvedValue(undefined);
		mockDeleteAccount.mockResolvedValue(undefined);
	});

	// ── editName ──────────────────────────────────────────────────────────────

	describe("editName", () => {
		it("happy path: opens input, calls updateProfile with name", async () => {
			mockInput.mockResolvedValue("New Name");

			const { result } = renderHook(() => useProfileActions());
			result.current.editName();

			await waitFor(() => {
				expect(mockUpdateProfile).toHaveBeenCalledWith({ name: "New Name" });
			});
		});

		it("does nothing when input returns null (user cancels)", async () => {
			mockInput.mockResolvedValue(null);

			const { result } = renderHook(() => useProfileActions());
			result.current.editName();

			await flushPromises();
			expect(mockUpdateProfile).not.toHaveBeenCalled();
		});

		it("shows error alert when updateProfile throws", async () => {
			mockInput.mockResolvedValue("New Name");
			mockUpdateProfile.mockRejectedValue(new Error("API error"));

			const { result } = renderHook(() => useProfileActions());
			result.current.editName();

			await waitFor(() => {
				expect(mockAlert).toHaveBeenCalledTimes(1);
			});
		});
	});

	// ── editEmail ─────────────────────────────────────────────────────────────

	describe("editEmail", () => {
		it("happy path: opens input, calls updateUserEmail", async () => {
			mockInput.mockResolvedValue("new@example.com");

			const { result } = renderHook(() => useProfileActions());
			result.current.editEmail();

			await waitFor(() => {
				expect(mockUpdateUserEmail).toHaveBeenCalledWith("new@example.com");
			});
		});

		it("shows error alert when updateUserEmail throws", async () => {
			mockInput.mockResolvedValue("new@example.com");
			mockUpdateUserEmail.mockRejectedValue(new Error("API error"));

			const { result } = renderHook(() => useProfileActions());
			result.current.editEmail();

			await waitFor(() => {
				expect(mockAlert).toHaveBeenCalledTimes(1);
			});
		});
	});

	// ── editBirthday ──────────────────────────────────────────────────────────

	describe("editBirthday", () => {
		it("happy path: opens input, calls updateProfile with birthday", async () => {
			mockInput.mockResolvedValue("1995-06-15");

			const { result } = renderHook(() => useProfileActions());
			result.current.editBirthday();

			await waitFor(() => {
				expect(mockUpdateProfile).toHaveBeenCalledWith({ birthday: "1995-06-15" });
			});
		});
	});

	// ── editPassword ──────────────────────────────────────────────────────────

	describe("editPassword", () => {
		it("happy path: collects current + new password, calls updateUserPassword", async () => {
			mockInput.mockResolvedValueOnce("currentPass123").mockResolvedValueOnce("newPass456");

			const { result } = renderHook(() => useProfileActions());
			result.current.editPassword();

			await waitFor(() => {
				expect(mockUpdateUserPassword).toHaveBeenCalledWith({
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
			expect(mockUpdateUserPassword).not.toHaveBeenCalled();
		});

		it("shows error alert when updateUserPassword throws", async () => {
			mockInput.mockResolvedValueOnce("currentPass123").mockResolvedValueOnce("newPass456");
			mockUpdateUserPassword.mockRejectedValue(new Error("wrong password"));

			const { result } = renderHook(() => useProfileActions());
			result.current.editPassword();

			await waitFor(() => {
				expect(mockAlert).toHaveBeenCalledTimes(1);
			});
		});
	});

	// ── handleLogout ──────────────────────────────────────────────────────────

	describe("handleLogout", () => {
		it("happy path: confirms, calls signOut, redirects", async () => {
			mockConfirm.mockResolvedValue(true);

			const { result } = renderHook(() => useProfileActions());
			result.current.handleLogout();

			await waitFor(() => {
				expect(mockSignOut).toHaveBeenCalled();
				expect(mockRouterReplace).toHaveBeenCalledWith("/(non-auth)/welcome");
			});
		});

		it("does nothing when user cancels confirm", async () => {
			mockConfirm.mockResolvedValue(false);

			const { result } = renderHook(() => useProfileActions());
			result.current.handleLogout();

			await flushPromises();
			expect(mockSignOut).not.toHaveBeenCalled();
			expect(mockRouterReplace).not.toHaveBeenCalled();
		});

		it("still redirects even when signOut throws", async () => {
			mockConfirm.mockResolvedValue(true);
			mockSignOut.mockRejectedValue(new Error("network error"));

			const { result } = renderHook(() => useProfileActions());
			result.current.handleLogout();

			await waitFor(() => {
				expect(mockRouterReplace).toHaveBeenCalledWith("/(non-auth)/welcome");
			});
		});
	});

	// ── handleDeleteAccount ───────────────────────────────────────────────────

	describe("handleDeleteAccount", () => {
		it("happy path: double confirm, calls deleteAccount, redirects", async () => {
			mockConfirm.mockResolvedValueOnce(true).mockResolvedValueOnce(true);

			const { result } = renderHook(() => useProfileActions());
			result.current.handleDeleteAccount();

			await waitFor(() => {
				expect(mockDeleteAccount).toHaveBeenCalled();
				expect(mockRouterReplace).toHaveBeenCalledWith("/(non-auth)/welcome");
			});
		});

		it("aborts after first confirm is rejected", async () => {
			mockConfirm.mockResolvedValueOnce(false);

			const { result } = renderHook(() => useProfileActions());
			result.current.handleDeleteAccount();

			await flushPromises();
			expect(mockDeleteAccount).not.toHaveBeenCalled();
		});

		it("aborts after second confirm is rejected", async () => {
			mockConfirm.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

			const { result } = renderHook(() => useProfileActions());
			result.current.handleDeleteAccount();

			await flushPromises();
			expect(mockDeleteAccount).not.toHaveBeenCalled();
		});

		it("still redirects even when deleteAccount throws", async () => {
			mockConfirm.mockResolvedValueOnce(true).mockResolvedValueOnce(true);
			mockDeleteAccount.mockRejectedValue(new Error("API error"));

			const { result } = renderHook(() => useProfileActions());
			result.current.handleDeleteAccount();

			await waitFor(() => {
				expect(mockRouterReplace).toHaveBeenCalledWith("/(non-auth)/welcome");
			});
		});
	});
});
