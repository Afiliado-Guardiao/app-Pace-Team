import { IAiContext } from "@/lib/supabase";

export interface IAiWeekBar {
	label: string;
	km: number;
	ratio: number;
	isCurrent: boolean;
}

export interface IAiWeekView {
	km: number;
	runs: number;
	pace: string | null;
	prevKm: number | null;
	bars: IAiWeekBar[];
}

const BARS = 8;

// 375 s/km → "6:15"
export const formatPace = (secKm: number | null): string | null => {
	if (secKm === null || secKm <= 0) return null;
	const min = Math.floor(secKm / 60);
	const sec = Math.round(secKm % 60);
	return `${String(min)}:${String(sec).padStart(2, "0")}`;
};

// "2026-11-09" → "09/11"
const dayMonth = (isoDate: string): string => `${isoDate.slice(8, 10)}/${isoDate.slice(5, 7)}`;

// Resumo da semana atual e as barras das últimas 8 semanas
export const aiWeekView = (context: IAiContext): IAiWeekView => {
	const weeks = context.weeks.slice(-BARS);
	const now = weeks.at(-1);
	const prev = weeks.at(-2);
	const max = Math.max(1, ...weeks.map((w) => w.km));
	return {
		km: now?.km ?? 0,
		runs: now?.runs ?? 0,
		pace: formatPace(now?.paceSecKm ?? null),
		prevKm: prev ? prev.km : null,
		bars: weeks.map((w, i) => ({
			label: dayMonth(w.start),
			km: w.km,
			ratio: w.km / max,
			isCurrent: i === weeks.length - 1,
		})),
	};
};
