import { useQuery } from "@tanstack/react-query";

import { getAiContext, IAiContext } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

interface IUseAiContextReturn {
	context: IAiContext | null;
	isLoading: boolean;
	refresh: () => Promise<unknown>;
}

const DAY = 86_400_000;
const iso = (t: number): string => new Date(t).toISOString().slice(0, 10);

// Prévia por link: um corredor que vem aumentando a distância
const demo = (): IAiContext => {
	const now = new Date();
	const back = (now.getDay() + 6) % 7;
	const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - back).getTime();
	const km = [8, 9.5, 7, 11, 12.4, 10.8, 13.5, 15.2, 14, 16.4, 18.1, 9.6];
	const runs = [2, 3, 2, 3, 3, 3, 4, 4, 3, 4, 4, 2];
	return {
		today: iso(now.getTime()),
		weekStart: iso(monday),
		questionsToday: 2,
		me: { name: null, totalKm: 146, totalRuns: 37, firstRun: iso(monday - 84 * DAY) },
		weeks: km.map((k, i) => ({
			start: iso(monday - (11 - i) * 7 * DAY),
			km: k,
			runs: runs[i] ?? 0,
			minutes: Math.round(k * 6.2),
			paceSecKm: 372 - i * 2,
		})),
		months: [],
		recent: [
			{ date: iso(now.getTime() - DAY), km: 5.2, minutes: 31.4, paceSecKm: 362, withTeam: true },
			{
				date: iso(now.getTime() - 3 * DAY),
				km: 4.4,
				minutes: 27.1,
				paceSecKm: 370,
				withTeam: false,
			},
		],
		team: {
			name: "Pace Sharks",
			weekKm: 82.4,
			prevWeekKm: 96.1,
			cityRank: { position: 3, teams: 12 },
			rival: null,
			mates: [],
		},
	};
};

// Números reais da semana que a PACE AI usa (o resumo no topo da conversa)
export const useAiContext = (isEnabled: boolean): IUseAiContextReturn => {
	const query = useQuery({
		queryKey: DATA_KEYS.aiContext,
		queryFn: getAiContext,
		enabled: isEnabled && !IS_PREVIEW,
		staleTime: 60_000,
	});
	if (IS_PREVIEW) {
		return { context: demo(), isLoading: false, refresh: () => Promise.resolve() };
	}
	return { context: query.data ?? null, isLoading: query.isLoading, refresh: query.refetch };
};
