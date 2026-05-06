import React from "react";
import { act, fireEvent, render } from "@testing-library/react-native";

import { ReferralSection } from "../index";

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string, opts?: Record<string, unknown>) => {
			if (opts?.code) return `Used: ${opts.code}`;
			if (opts?.count !== undefined) return `${opts.count} referrals`;
			return key;
		},
	}),
}));

jest.mock("@/theme", () => {
	const actual = jest.requireActual("@/theme") as Record<string, unknown>;
	const getTheme = actual.getTheme as () => unknown;
	return {
		...actual,
		useTheme: () => ({ theme: getTheme() }),
	};
});

const mockApplyCode = jest.fn();
const mockCopyMyCode = jest.fn();

jest.mock("../../../hooks/useReferralSection", () => ({
	useReferralSection: jest.fn(),
}));

import { useReferralSection } from "../../../hooks/useReferralSection";

const mockUseReferralSection = useReferralSection as jest.MockedFunction<typeof useReferralSection>;

function buildStats(overrides: Partial<{ myCode: string; usedCode: string | null; referralsCount: number }> = {}) {
	return {
		myCode: "MY123",
		usedCode: null,
		referralsCount: 3,
		...overrides,
	};
}

describe("ReferralSection", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockUseReferralSection.mockReturnValue({
			stats: buildStats(),
			isLoading: false,
			isApplying: false,
			applyCode: mockApplyCode,
			copyMyCode: mockCopyMyCode,
		});
	});

	it("mostra o myCode e o botão de copiar", () => {
		const { getByTestId } = render(<ReferralSection />);

		expect(getByTestId("referral-my-code").props.children).toBe("MY123");
		expect(getByTestId("btn-copy-referral")).toBeTruthy();
	});

	it("mostra input e botão aplicar quando usedCode é null", () => {
		const { getByTestId, queryByTestId } = render(<ReferralSection />);

		expect(getByTestId("input-apply-referral")).toBeTruthy();
		expect(getByTestId("btn-apply-referral")).toBeTruthy();
		expect(queryByTestId("referral-used-code")).toBeNull();
	});

	it("normaliza o input em tempo real para uppercase sem caracteres especiais", () => {
		const { getByTestId } = render(<ReferralSection />);

		const input = getByTestId("input-apply-referral");

		act(() => {
			fireEvent.changeText(input, "abc 123");
		});

		expect(input.props.value).toBe("ABC123");
	});

	it("chama applyCode com valor normalizado ao pressionar Aplicar", () => {
		const { getByTestId } = render(<ReferralSection />);

		act(() => {
			fireEvent.changeText(getByTestId("input-apply-referral"), "abc 123");
		});

		act(() => {
			fireEvent.press(getByTestId("btn-apply-referral"));
		});

		expect(mockApplyCode).toHaveBeenCalledWith("ABC123");
	});

	it("não chama applyCode quando código normalizado tem menos de 4 chars", () => {
		const { getByTestId } = render(<ReferralSection />);

		act(() => {
			fireEvent.changeText(getByTestId("input-apply-referral"), "ab");
		});

		act(() => {
			fireEvent.press(getByTestId("btn-apply-referral"));
		});

		expect(mockApplyCode).not.toHaveBeenCalled();
	});

	it("mostra referral-used-code e esconde o input quando usedCode está preenchido", () => {
		mockUseReferralSection.mockReturnValue({
			stats: buildStats({ usedCode: "FRIEND99" }),
			isLoading: false,
			isApplying: false,
			applyCode: mockApplyCode,
			copyMyCode: mockCopyMyCode,
		});

		const { getByTestId, queryByTestId } = render(<ReferralSection />);

		expect(getByTestId("referral-used-code")).toBeTruthy();
		expect(queryByTestId("input-apply-referral")).toBeNull();
		expect(queryByTestId("btn-apply-referral")).toBeNull();
	});

	it("mostra apenas título enquanto está carregando", () => {
		mockUseReferralSection.mockReturnValue({
			stats: undefined,
			isLoading: true,
			isApplying: false,
			applyCode: mockApplyCode,
			copyMyCode: mockCopyMyCode,
		});

		const { queryByTestId } = render(<ReferralSection />);

		expect(queryByTestId("referral-my-code")).toBeNull();
		expect(queryByTestId("btn-copy-referral")).toBeNull();
	});

	it("limpa o input após aplicar código válido", () => {
		const { getByTestId } = render(<ReferralSection />);

		const input = getByTestId("input-apply-referral");

		act(() => {
			fireEvent.changeText(input, "VALID1");
		});

		act(() => {
			fireEvent.press(getByTestId("btn-apply-referral"));
		});

		expect(input.props.value).toBe("");
	});
});
