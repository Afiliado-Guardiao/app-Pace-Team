import { renderHook, waitFor } from "@testing-library/react-native";

import { useReferralPrompt } from "../useReferralPrompt";

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

const mockConfirm = jest.fn();
const mockInput = jest.fn();
const mockAlert = jest.fn();

jest.mock("@/components/ui/Modal", () => ({
	useModal: () => ({
		confirm: mockConfirm,
		input: mockInput,
		alert: mockAlert,
		close: jest.fn(),
		custom: jest.fn(),
	}),
}));

const mockApplyReferralCode = jest.fn();

jest.mock("@/lib/api/referral", () => ({
	applyReferralCode: (...args: unknown[]) => mockApplyReferralCode(...args),
}));

jest.mock("@/store", () => ({
	useStore: jest.fn(),
}));

import { useStore } from "@/store";

const mockUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockSetHasSeenReferralPrompt = jest.fn();

interface IMockStoreState {
	_hasHydrated: boolean;
	isAuthenticated: boolean;
	hasSeenReferralPrompt: boolean;
	setHasSeenReferralPrompt: jest.Mock;
}

function setupStore(
	overrides: {
		hasHydrated?: boolean;
		isAuthenticated?: boolean;
		hasSeen?: boolean;
	} = {},
): void {
	const state: IMockStoreState = {
		_hasHydrated: overrides.hasHydrated ?? true,
		isAuthenticated: overrides.isAuthenticated ?? true,
		hasSeenReferralPrompt: overrides.hasSeen ?? false,
		setHasSeenReferralPrompt: mockSetHasSeenReferralPrompt,
	};

	mockUseStore.mockImplementation((selector: (s: IMockStoreState) => unknown) =>
		selector(state),
	);
}

async function flushPromises(): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("useReferralPrompt", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockConfirm.mockResolvedValue(false);
		mockInput.mockResolvedValue(null);
		mockAlert.mockResolvedValue(undefined);
		mockApplyReferralCode.mockResolvedValue({});
	});

	it("não abre modal quando hasHydrated é false", async () => {
		setupStore({ hasHydrated: false });

		renderHook(() => useReferralPrompt());
		await flushPromises();

		expect(mockConfirm).not.toHaveBeenCalled();
	});

	it("não abre modal quando isAuthenticated é false", async () => {
		setupStore({ isAuthenticated: false });

		renderHook(() => useReferralPrompt());
		await flushPromises();

		expect(mockConfirm).not.toHaveBeenCalled();
	});

	it("não abre modal quando hasSeen é true", async () => {
		setupStore({ hasSeen: true });

		renderHook(() => useReferralPrompt());
		await flushPromises();

		expect(mockConfirm).not.toHaveBeenCalled();
	});

	it("happy path: aplica código normalizado quando usuário confirma e digita código", async () => {
		setupStore();
		mockConfirm.mockResolvedValue(true);
		mockInput.mockResolvedValue("abc 123");

		renderHook(() => useReferralPrompt());

		await waitFor(() => {
			expect(mockApplyReferralCode).toHaveBeenCalledWith({ code: "ABC123" });
		});
	});

	it("chama setHasSeenReferralPrompt(true) após confirmar e aplicar código", async () => {
		setupStore();
		mockConfirm.mockResolvedValue(true);
		mockInput.mockResolvedValue("VALID1");

		renderHook(() => useReferralPrompt());

		await waitFor(() => {
			expect(mockSetHasSeenReferralPrompt).toHaveBeenCalledWith(true);
		});
	});

	it("chama setHasSeenReferralPrompt(true) mesmo quando usuário skipa (confirm = false)", async () => {
		setupStore();
		mockConfirm.mockResolvedValue(false);

		renderHook(() => useReferralPrompt());

		await waitFor(() => {
			expect(mockSetHasSeenReferralPrompt).toHaveBeenCalledWith(true);
		});
	});

	it("não chama applyReferralCode quando modal.input retorna null (usuário cancela)", async () => {
		setupStore();
		mockConfirm.mockResolvedValue(true);
		mockInput.mockResolvedValue(null);

		renderHook(() => useReferralPrompt());

		await waitFor(() => {
			expect(mockSetHasSeenReferralPrompt).toHaveBeenCalledWith(true);
		});

		expect(mockApplyReferralCode).not.toHaveBeenCalled();
	});

	it("validation callback retorna 'invalid' para código com menos de 4 chars após normalização", async () => {
		setupStore();
		mockConfirm.mockResolvedValue(true);

		let capturedValidation: ((value: string) => string | null) | undefined;

		mockInput.mockImplementation(
			(opts: { validation?: (v: string) => string | null }) => {
				capturedValidation = opts.validation;
				return Promise.resolve(null);
			},
		);

		renderHook(() => useReferralPrompt());

		await waitFor(() => {
			expect(capturedValidation).toBeDefined();
		});

		// "ab c!" → normaliza para "ABC" (3 chars) → inválido
		expect(capturedValidation!("ab c!")).toBe("invalid");
		// "abcd" → "ABCD" (4 chars) → válido
		expect(capturedValidation!("abcd")).toBeNull();
	});

	it("não dispara modal de novo em re-renders (useRef guard)", async () => {
		setupStore();
		mockConfirm.mockResolvedValue(false);

		const { rerender } = renderHook(() => useReferralPrompt());

		await waitFor(() => {
			expect(mockConfirm).toHaveBeenCalledTimes(1);
		});

		rerender({});
		rerender({});
		await flushPromises();

		expect(mockConfirm).toHaveBeenCalledTimes(1);
	});

	it("mostra alert de erro quando applyReferralCode lança exceção", async () => {
		setupStore();
		mockConfirm.mockResolvedValue(true);
		mockInput.mockResolvedValue("VALID1");
		mockApplyReferralCode.mockRejectedValue(new Error("invalid code"));

		renderHook(() => useReferralPrompt());

		await waitFor(() => {
			expect(mockAlert).toHaveBeenCalledTimes(1);
		});

		expect(mockSetHasSeenReferralPrompt).toHaveBeenCalledWith(true);
	});
});
