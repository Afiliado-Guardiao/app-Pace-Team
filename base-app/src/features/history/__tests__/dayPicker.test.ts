import { act, renderHook } from "@testing-library/react-native";

import { ISavedRun } from "@/lib/supabase";

import { useHistoryMonth } from "../hooks/useHistoryMonth";
import { buildDayCells, dayLabel, monthKeyOf } from "../utils";

const run = (id: string, startedAt: string, km: number): ISavedRun =>
	({ id, startedAt, km, points: km * 8, status: "valid" }) as unknown as ISavedRun;

const STATS = { monthKm: 99, monthRuns: 9, monthPoints: 999 };

describe("grade de dias do Histórico", () => {
	it("começa no dia da semana certo e marca as corridas", () => {
		// Novembro de 2026 começa num domingo; outubro de 2026 numa quinta
		const nov = buildDayCells("2026-11", new Map([[16, 2]]), new Date(2026, 10, 16));
		expect(nov[0].day).toBe(1);
		expect(nov).toHaveLength(30);
		expect(nov[15]).toEqual({ day: 16, runs: 2, isToday: true });
		const oct = buildDayCells("2026-10", new Map(), new Date(2026, 10, 16));
		expect(oct.slice(0, 4).every((c) => c.day === null)).toBe(true);
		expect(oct[4].day).toBe(1);
		expect(oct.some((c) => c.isToday)).toBe(false);
	});

	it("escreve o dia curto", () => {
		expect(dayLabel("2026-11", 16)).toBe("16 de nov");
	});
});

describe("useHistoryMonth com dia", () => {
	const now = new Date();
	const key = monthKeyOf(now);
	const y = now.getFullYear();
	const m = now.getMonth();
	const saved = [
		run("a", new Date(y, m, 3, 7).toISOString(), 5),
		run("b", new Date(y, m, 3, 18).toISOString(), 3),
		run("c", new Date(y, m, 9, 7).toISOString(), 10),
	];

	it("filtra a lista e o resumo pelo dia escolhido e volta para o mês", () => {
		const { result } = renderHook(() => useHistoryMonth(saved, STATS));
		expect(result.current.selected).toBe(key);
		expect(result.current.dayCells.find((c) => c.day === 3)?.runs).toBe(2);

		act(() => {
			result.current.openPicker();
		});
		act(() => {
			result.current.pickDay(3);
		});
		expect(result.current.isPickerOpen).toBe(false);
		expect(result.current.isInMonth("a")).toBe(true);
		expect(result.current.isInMonth("b")).toBe(true);
		expect(result.current.isInMonth("c")).toBe(false);
		expect(result.current.summary.runs).toBe("2");
		expect(result.current.summary.label).toBe(dayLabel(key, 3));

		act(() => {
			result.current.showWholeMonth();
		});
		expect(result.current.day).toBeNull();
		expect(result.current.isInMonth("c")).toBe(true);
		// Mês atual inteiro usa os números do servidor
		expect(result.current.summary.runs).toBe("9");
	});

	it("trocar o mês limpa o dia e deixa a folha aberta", () => {
		const { result } = renderHook(() => useHistoryMonth(saved, STATS));
		act(() => {
			result.current.openPicker();
			result.current.pickDay(9);
		});
		act(() => {
			result.current.openPicker();
		});
		act(() => {
			result.current.pick("2020-01");
		});
		expect(result.current.day).toBeNull();
		expect(result.current.isPickerOpen).toBe(true);
		expect(result.current.dayCells.every((c) => c.runs === 0)).toBe(true);
	});
});
