import { act, renderHook } from "@testing-library/react-native";

import { useBuddyIdle } from "../hooks/useBuddyIdle";

jest.mock("expo-haptics", () => ({
	impactAsync: jest.fn(),
	ImpactFeedbackStyle: { Medium: "medium" },
}));

describe("useBuddyIdle", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});
	afterEach(() => {
		jest.useRealTimers();
	});

	it("fica curioso, inquieto e dorme sem toque", () => {
		const setAct = jest.fn();
		const { result } = renderHook(() => useBuddyIdle(true, setAct));
		expect(result.current.idleSpeech).toBeNull();
		act(() => {
			jest.advanceTimersByTime(5000);
		});
		expect(setAct).toHaveBeenLastCalledWith("curious");
		act(() => {
			jest.advanceTimersByTime(5000);
		});
		expect(setAct).toHaveBeenLastCalledWith("shake");
		act(() => {
			jest.advanceTimersByTime(14000);
		});
		expect(setAct).toHaveBeenLastCalledWith("sleep");
		expect(result.current.idleSpeech?.title).toBe("Zzz…");
	});

	it("acorda com um toque e recomeça a contagem", () => {
		const setAct = jest.fn();
		const { result } = renderHook(() => useBuddyIdle(true, setAct));
		act(() => {
			jest.advanceTimersByTime(24000);
		});
		act(() => {
			result.current.bump();
		});
		expect(setAct).toHaveBeenLastCalledWith("wake");
		expect(result.current.idleSpeech).toBeNull();
		act(() => {
			jest.advanceTimersByTime(900);
		});
		expect(setAct).toHaveBeenLastCalledWith("wave");
		act(() => {
			jest.advanceTimersByTime(4100);
		});
		expect(setAct).toHaveBeenLastCalledWith("curious");
	});

	it("fechado, não faz nada", () => {
		const setAct = jest.fn();
		renderHook(() => useBuddyIdle(false, setAct));
		act(() => {
			jest.advanceTimersByTime(30000);
		});
		expect(setAct).not.toHaveBeenCalled();
	});
});
