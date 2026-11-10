import { DimensionValue } from "react-native";

import { formatKm } from "@/lib/pace";
import { IAnalyticsMember, ITeamAnalytics } from "@/lib/supabase";

export interface IInsight {
	icon: string;
	text: string;
	tone: "accent" | "good" | "bad";
}

export interface IAnalyticsBar {
	label: string;
	km: number;
	ratio: number;
	isCurrent: boolean;
}

export interface IAnalyticsMemberRow extends IAnalyticsMember {
	isConsistent: boolean;
	needsHelp: boolean;
	ratio: number;
}

export interface IAnalyticsView {
	weekKm: string;
	// +15 / −8 (null sem semana anterior para comparar)
	deltaPct: number | null;
	runners: number;
	members: number;
	position: number | null;
	// Posições ganhas desde a semana passada (positivo = subiu)
	climbed: number;
	insights: IInsight[];
	bars: IAnalyticsBar[];
	ranks: { label: string; position: number | null }[];
	period: { km: string; prevKm: string; deltaPct: number | null };
	rows: IAnalyticsMemberRow[];
}

const pct = (now: number, before: number): number | null =>
	before > 0 ? Math.round(((now - before) / before) * 100) : null;
const dayMonth = (iso: string): string => {
	const d = new Date(iso);
	return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
};
// 0..1 → "42%" (largura das barras)
export const pctWidth = (ratio: number): DimensionValue =>
	`${String(Math.round(Math.max(0, Math.min(1, ratio)) * 100))}%` as DimensionValue;
const firstName = (name: string): string => name.split(" ")[0] ?? name;
const sum = (list: readonly number[]): number => list.reduce((a, b) => a + b, 0);

const insightsOf = (a: ITeamAnalytics, v: Omit<IAnalyticsView, "insights">): IInsight[] => {
	const out: IInsight[] = [
		{ icon: "route", text: `A equipe correu ${v.weekKm} km nesta semana.`, tone: "accent" },
	];
	if (v.deltaPct !== null) {
		const up = v.deltaPct >= 0;
		out.push({
			icon: up ? "trending-up" : "trending-down",
			text: `${up ? "+" : ""}${String(v.deltaPct)}% em relação à semana passada.`,
			tone: up ? "good" : "bad",
		});
	}
	out.push({
		icon: "users",
		text: `${String(v.runners)} de ${String(v.members)} integrantes correram.`,
		tone: "accent",
	});
	if (a.rival && a.rival.gapKm > 0) {
		out.push({
			icon: "flag",
			text: `Faltam ${formatKm(a.rival.gapKm, 1)} km para alcançar a ${a.rival.name}.`,
			tone: "accent",
		});
	}
	const best = v.rows.find((r) => r.isConsistent);
	if (best) {
		out.push({
			icon: "flame",
			text: `Mais constante: ${firstName(best.name)}, ${String(best.weekDays)} dias de corrida na semana.`,
			tone: "good",
		});
	}
	if (v.climbed !== 0) {
		const up = v.climbed > 0;
		const n = Math.abs(v.climbed);
		out.push({
			icon: up ? "arrow-up" : "arrow-down",
			text: `A equipe ${up ? "subiu" : "caiu"} ${String(n)} ${n === 1 ? "posição" : "posições"} no ranking.`,
			tone: up ? "good" : "bad",
		});
	}
	const help = v.rows.filter((r) => r.needsHelp).map((r) => firstName(r.name));
	if (help.length)
		out.push({
			icon: "heart-handshake",
			text: `Ainda não correram: ${help.join(", ")}. Bora chamar?`,
			tone: "bad",
		});
	return out;
};

const rowsOf = (members: readonly IAnalyticsMember[]): IAnalyticsMemberRow[] => {
	const top = Math.max(1, ...members.map((m) => m.weekKm));
	const bestDays = Math.max(...members.map((m) => m.weekDays), 0);
	const bestId = members.find((m) => bestDays > 0 && m.weekDays === bestDays)?.id;
	return members.map((m) => ({
		...m,
		isConsistent: m.id === bestId,
		needsHelp: m.weekKm <= 0,
		ratio: m.weekKm / top,
	}));
};

// Tudo o que a tela mostra, calculado dos números reais da equipe
export const analyticsView = (a: ITeamAnalytics): IAnalyticsView => {
	const now = a.weeks.at(-1);
	const prev = a.weeks.at(-2);
	const top = Math.max(1, ...a.weeks.map((w) => w.km));
	const position = now?.rank.position ?? null;
	const before = prev?.rank.position ?? null;
	const last4 = sum(a.weeks.slice(-4).map((w) => w.km));
	const prev4 = sum(a.weeks.slice(-8, -4).map((w) => w.km));
	const base = {
		weekKm: formatKm(now?.km ?? 0, 1),
		deltaPct: pct(now?.km ?? 0, prev?.km ?? 0),
		runners: now?.runners ?? 0,
		members: a.team.members,
		position,
		climbed: position && before ? before - position : 0,
		bars: a.weeks.map((w, i) => ({
			label: dayMonth(w.start),
			km: w.km,
			ratio: w.km / top,
			isCurrent: i === a.weeks.length - 1,
		})),
		ranks: a.weeks.map((w) => ({ label: dayMonth(w.start), position: w.rank.position })),
		period: { km: formatKm(last4, 1), prevKm: formatKm(prev4, 1), deltaPct: pct(last4, prev4) },
		rows: rowsOf(a.members),
	};
	return { ...base, insights: insightsOf(a, base) };
};
