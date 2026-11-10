import { useQuery } from "@tanstack/react-query";

import { getTeamAnalytics, ITeamAnalytics } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

interface IUseTeamAnalyticsReturn {
	data: ITeamAnalytics | null;
	isLoading: boolean;
	isError: boolean;
	refresh: () => void;
}

const DAY = 86_400_000;
const monday = (): number => {
	const now = new Date();
	const back = (now.getDay() + 6) % 7;
	return new Date(now.getFullYear(), now.getMonth(), now.getDate() - back).getTime();
};

// Prévia por link: a Pace Sharks do design, 8 semanas subindo no ranking
const demo = (): ITeamAnalytics => {
	const start = monday();
	const km = [96, 112, 104, 131, 128, 150, 156, 180];
	const pos = [9, 8, 8, 7, 7, 6, 7, 3];
	const runners = [6, 7, 6, 8, 7, 8, 9, 8];
	return {
		team: {
			id: "demo",
			name: "Pace Sharks",
			city: "Campinas",
			size: 10,
			logoUrl: null,
			members: 10,
		},
		weekStart: new Date(start).toISOString(),
		weeks: km.map((k, i) => ({
			start: new Date(start - (7 - i) * 7 * DAY).toISOString(),
			km: k,
			points: Math.round(k * 8),
			runs: runners[i] ?? 0,
			runners: runners[i] ?? 0,
			rank: { position: pos[i] ?? null, teams: 14 },
		})),
		members: [
			["Ana Souza", 31.2, 5, 5, 26.0, 104, 17],
			["Lucas Moreira", 28.4, 4, 4, 24.5, 96, 15],
			["Rafael Lima", 24.0, 3, 3, 27.1, 88, 12],
			["Bia Carvalho", 22.6, 4, 4, 18.0, 80, 14],
			["Diego Prado", 20.1, 3, 3, 15.2, 61, 10],
			["Marina Costa", 18.3, 2, 2, 16.8, 58, 8],
			["Pedro Alves", 17.9, 3, 3, 14.0, 52, 9],
			["Júlia Rocha", 17.5, 2, 2, 12.4, 47, 7],
			["Caio Mendes", 0, 0, 0, 9.8, 22, 4],
			["Rita Nunes", 0, 0, 0, 0, 6, 2],
		].map(([name, weekKm, weekRuns, weekDays, prevWeekKm, kmMonth, days], i) => ({
			id: `demo-${String(i)}`,
			name: String(name),
			avatarPath: null,
			role: i === 1 ? "captain" : "athlete",
			isYou: i === 1,
			weekKm: Number(weekKm),
			weekRuns: Number(weekRuns),
			weekDays: Number(weekDays),
			prevWeekKm: Number(prevWeekKm),
			km28: Number(kmMonth),
			days28: Number(days),
		})),
		rival: {
			name: "Night Runners",
			logoUrl: null,
			position: 2,
			points: 1616,
			km: 202,
			gapPoints: 176,
			gapKm: 22,
		},
	};
};

// Team Analytics da equipe (Team Pro). Na prévia, os dados de exemplo.
export const useTeamAnalytics = (): IUseTeamAnalyticsReturn => {
	const query = useQuery({
		queryKey: DATA_KEYS.teamAnalytics,
		queryFn: getTeamAnalytics,
		enabled: !IS_PREVIEW,
		staleTime: 60_000,
	});
	if (IS_PREVIEW) {
		return { data: demo(), isLoading: false, isError: false, refresh: () => undefined };
	}
	return {
		data: query.data ?? null,
		isLoading: query.isLoading,
		isError: query.isError,
		refresh: () => {
			void query.refetch();
		},
	};
};
