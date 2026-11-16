import { useMemo, useState } from "react";

import { formatKm, formatPoints } from "@/lib/pace";
import { ISavedRun } from "@/lib/supabase";

import {
	buildDayCells,
	dayLabel,
	IDayCell,
	IRunDate,
	ISummary,
	monthKeyOf,
	monthLabel,
	runDateOf,
	summarize,
} from "../utils";

export interface IMonthOption {
	key: string;
	label: string;
}

interface IMonthStats {
	monthKm: number;
	monthRuns: number;
	monthPoints: number;
}

export interface IUseHistoryMonthReturn {
	isPickerOpen: boolean;
	openPicker: () => void;
	closePicker: () => void;
	options: IMonthOption[];
	selected: string;
	// Dia escolhido dentro do mês (null = mês inteiro)
	day: number | null;
	dayCells: IDayCell[];
	// Troca o mês e deixa a folha aberta para escolher o dia
	pick: (key: string) => void;
	pickDay: (day: number) => void;
	// Volta para o mês inteiro
	showWholeMonth: () => void;
	summary: ISummary;
	// A corrida é do mês (e do dia, se escolhido)?
	isInMonth: (id: string | number) => boolean;
}

// Calendário do Histórico: escolhe o mês e, se quiser, um dia; o resumo e a
// lista mostram só ele. O mês atual inteiro usa os números do servidor; o
// resto soma as corridas salvas.
export const useHistoryMonth = (
	saved: readonly ISavedRun[],
	stats: IMonthStats,
): IUseHistoryMonthReturn => {
	const now = new Date();
	const current = monthKeyOf(now);
	const year = now.getFullYear();
	const [selected, setSelected] = useState(current);
	const [day, setDay] = useState<number | null>(null);
	const [isPickerOpen, setIsPickerOpen] = useState(false);

	const dateById = useMemo(
		() => new Map<string, IRunDate>(saved.map((r) => [r.id, runDateOf(r.startedAt)])),
		[saved],
	);
	const options = useMemo(() => {
		const keys = new Set([current, ...[...dateById.values()].map((d) => d.month)]);
		return [...keys]
			.sort((a, b) => (a < b ? 1 : -1))
			.map((key) => ({ key, label: monthLabel(key, year) }));
	}, [dateById, current, year]);

	const dayCells = useMemo(() => {
		const runsByDay = new Map<number, number>();
		for (const d of dateById.values()) {
			if (d.month === selected) runsByDay.set(d.day, (runsByDay.get(d.day) ?? 0) + 1);
		}
		return buildDayCells(selected, runsByDay, new Date());
	}, [dateById, selected]);

	const isPicked = (id: string | number): boolean => {
		// Corrida sem data conhecida (ex.: exemplo da prévia) fica no mês atual
		const date = dateById.get(String(id)) ?? { month: current, day: -1 };
		return date.month === selected && (day === null || date.day === day);
	};

	const summary = useMemo(() => {
		if (day !== null) {
			const onDay = saved.filter((r) => {
				const d = dateById.get(r.id);
				return d?.month === selected && d.day === day;
			});
			return summarize(dayLabel(selected, day), onDay);
		}
		const label = monthLabel(selected, year);
		if (selected !== current) {
			return summarize(
				label,
				saved.filter((r) => dateById.get(r.id)?.month === selected),
			);
		}
		return {
			label,
			km: formatKm(stats.monthKm, 1),
			runs: String(stats.monthRuns),
			points: formatPoints(stats.monthPoints),
		};
	}, [selected, day, current, year, stats, saved, dateById]);

	return {
		isPickerOpen,
		openPicker: () => {
			setIsPickerOpen(true);
		},
		closePicker: () => {
			setIsPickerOpen(false);
		},
		options,
		selected,
		day,
		dayCells,
		pick: (key) => {
			setSelected(key);
			setDay(null);
		},
		pickDay: (d) => {
			setDay(d);
			setIsPickerOpen(false);
		},
		showWholeMonth: () => {
			setDay(null);
			setIsPickerOpen(false);
		},
		summary,
		isInMonth: isPicked,
	};
};
