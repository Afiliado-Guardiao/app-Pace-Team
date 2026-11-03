import { useMemo, useState } from "react";

import { formatKm, formatPoints } from "@/lib/pace";
import { ISavedRun } from "@/lib/supabase";

import { MONTH_NAMES } from "../constants";

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
	pick: (key: string) => void;
	summary: { label: string; km: string; runs: string; points: string };
	// A corrida é do mês escolhido?
	isInMonth: (id: string | number) => boolean;
}

// "2026-10"
const keyOf = (date: Date): string =>
	`${String(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const labelOf = (key: string, currentYear: number): string => {
	const [year, month] = key.split("-").map(Number);
	const name = MONTH_NAMES.at(month - 1) ?? "";
	return year === currentYear ? name : `${name} ${String(year)}`;
};

// Calendário do Histórico: escolhe o mês e o resumo e a lista mostram só ele.
// O mês atual usa os números do servidor; os outros somam as corridas salvas.
export const useHistoryMonth = (
	saved: readonly ISavedRun[],
	stats: IMonthStats,
): IUseHistoryMonthReturn => {
	const now = new Date();
	const current = keyOf(now);
	const year = now.getFullYear();
	const [selected, setSelected] = useState(current);
	const [isPickerOpen, setIsPickerOpen] = useState(false);

	const monthById = useMemo(
		() => new Map(saved.map((r) => [r.id, keyOf(new Date(r.startedAt))])),
		[saved],
	);
	const options = useMemo(() => {
		const keys = new Set([current, ...monthById.values()]);
		return [...keys]
			.sort((a, b) => (a < b ? 1 : -1))
			.map((key) => ({ key, label: labelOf(key, year) }));
	}, [monthById, current, year]);

	const summary = useMemo(() => {
		const label = labelOf(selected, year);
		if (selected === current) {
			return {
				label,
				km: formatKm(stats.monthKm, 1),
				runs: String(stats.monthRuns),
				points: formatPoints(stats.monthPoints),
			};
		}
		const inMonth = saved.filter((r) => monthById.get(r.id) === selected);
		const valid = inMonth.filter((r) => r.status === "valid");
		return {
			label,
			km: formatKm(
				valid.reduce((sum, r) => sum + r.km, 0),
				1,
			),
			runs: String(valid.length),
			points: formatPoints(valid.reduce((sum, r) => sum + r.points, 0)),
		};
	}, [selected, current, year, stats, saved, monthById]);

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
		pick: (key) => {
			setSelected(key);
			setIsPickerOpen(false);
		},
		summary,
		// Corrida sem data conhecida (ex.: exemplo da prévia) fica no mês atual
		isInMonth: (id) => (monthById.get(String(id)) ?? current) === selected,
	};
};
