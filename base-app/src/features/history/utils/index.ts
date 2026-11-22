import { formatKm, formatPoints } from "@/lib/pace";
import { IGamePoints, ISavedRun } from "@/lib/supabase";

import { MONTH_NAMES } from "../constants";

export interface IRunDate {
	// "2026-10"
	month: string;
	day: number;
}

export interface IDayCell {
	// null = espaço vazio antes do dia 1
	day: number | null;
	runs: number;
	isToday: boolean;
}

export interface ISummary {
	label: string;
	km: string;
	runs: string;
	points: string;
}

const pad = (n: number): string => String(n).padStart(2, "0");

export const monthKeyOf = (date: Date): string =>
	`${String(date.getFullYear())}-${pad(date.getMonth() + 1)}`;

export const runDateOf = (startedAt: string): IRunDate => {
	const date = new Date(startedAt);
	return { month: monthKeyOf(date), day: date.getDate() };
};

const parseKey = (key: string): [number, number] => {
	const [year, month] = key.split("-").map(Number);
	return [year, month];
};

// "Outubro" no ano atual, "Outubro 2025" nos outros
export const monthLabel = (key: string, currentYear: number): string => {
	const [year, month] = parseKey(key);
	const name = MONTH_NAMES.at(month - 1) ?? "";
	return year === currentYear ? name : `${name} ${String(year)}`;
};

// "16 de nov"
export const dayLabel = (key: string, day: number): string => {
	const [, month] = parseKey(key);
	const name = (MONTH_NAMES.at(month - 1) ?? "").slice(0, 3).toLowerCase();
	return `${String(day)} de ${name}`;
};

// "16 de novembro" (leitor de tela)
export const dayLabelLong = (key: string, day: number): string => {
	const [, month] = parseKey(key);
	return `${String(day)} de ${(MONTH_NAMES.at(month - 1) ?? "").toLowerCase()}`;
};

// Grade do mês começando no domingo: espaços vazios + um quadrado por dia,
// com quantas corridas o atleta fez naquele dia
export const buildDayCells = (
	key: string,
	runsByDay: ReadonlyMap<number, number>,
	today: Date,
): IDayCell[] => {
	const [year, month] = parseKey(key);
	const offset = new Date(year, month - 1, 1).getDay();
	const total = new Date(year, month, 0).getDate();
	const isThisMonth = monthKeyOf(today) === key;
	const blanks = Array.from({ length: offset }, () => ({ day: null, runs: 0, isToday: false }));
	const days = Array.from({ length: total }, (_, i) => ({
		day: i + 1,
		runs: runsByDay.get(i + 1) ?? 0,
		isToday: isThisMonth && today.getDate() === i + 1,
	}));
	return [...blanks, ...days];
};

// Roletas do mês (e do dia, se escolhido)
export const gamesIn = (
	games: readonly IGamePoints[],
	month: string,
	day: number | null,
): IGamePoints[] =>
	games.filter((g) => {
		const date = runDateOf(g.at);
		return date.month === month && (day === null || date.day === day);
	});

// Soma das corridas validadas (km, quantidade e pontos) com os pontos da
// roleta da equipe (ganhos ou perdidos; nunca abaixo de zero)
export const summarize = (label: string, runs: readonly ISavedRun[], gamePoints = 0): ISummary => {
	const valid = runs.filter((r) => r.status === "valid");
	return {
		label,
		km: formatKm(
			valid.reduce((sum, r) => sum + r.km, 0),
			1,
		),
		runs: String(valid.length),
		points: formatPoints(Math.max(0, valid.reduce((sum, r) => sum + r.points, 0) + gamePoints)),
	};
};
