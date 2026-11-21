import { act, renderHook } from "@testing-library/react-native";

import { useTickCount } from "../hooks/useTickCount";

describe("useTickCount", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});
	afterEach(() => {
		jest.useRealTimers();
	});

	it("acende até o fim e volta até o valor", () => {
		const { result } = renderHook(() =>
			useTickCount({ target: 10, isActive: true, total: 54, replay: 0 }),
		);
		act(() => {
			jest.advanceTimersByTime(200 + 54 * 11);
		});
		expect(result.current).toBe(54);
		act(() => {
			jest.advanceTimersByTime(5000);
		});
		expect(result.current).toBe(10);
	});

	it("anima de novo quando o app abre ou volta ao Início (replay)", () => {
		const { result, rerender } = renderHook(
			(p: { replay: number }) =>
				useTickCount({ target: 0, isActive: true, total: 54, replay: p.replay }),
			{ initialProps: { replay: 0 } },
		);
		act(() => {
			jest.advanceTimersByTime(5000);
		});
		expect(result.current).toBe(0);
		rerender({ replay: 1 });
		act(() => {
			jest.advanceTimersByTime(200 + 54 * 11);
		});
		expect(result.current).toBe(54);
		act(() => {
			jest.advanceTimersByTime(5000);
		});
		expect(result.current).toBe(0);
	});
});
