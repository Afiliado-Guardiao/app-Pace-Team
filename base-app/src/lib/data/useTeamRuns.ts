import { useQuery } from "@tanstack/react-query";

import { formatPace, GROUP_RUN, MY_TEAM } from "@/lib/pace";
import { getTeamLastRuns, ITeamLastRun, ITeamLastRuns } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";
import { runDate } from "./mappers";
import { useMyTeam } from "./useMyTeam";

export interface ITeamRunMember {
	name: string;
	km: number;
	pace: string;
	points: number;
	isYou: boolean;
}

// "Corrida da equipe": quem correu no dia mais recente com corrida da equipe.
export interface ITeamRunsView {
	hasTeam: boolean;
	hasRuns: boolean;
	// "Pace Sharks · Hoje · 06:42"
	label: string;
	totalKm: number;
	totalPoints: number;
	ran: number;
	size: number;
	// Maior distância primeiro
	members: ITeamRunMember[];
}

interface IUseTeamRunsReturn {
	view: ITeamRunsView;
	isLoading: boolean;
}

const DEMO_LABEL = `${MY_TEAM.name} · Hoje · 06:42`;

const DEMO_MEMBERS: ITeamRunMember[] = GROUP_RUN.map((m) => ({
	name: m.name,
	km: m.km,
	pace: m.pace,
	points: m.pts,
	isYou: "you" in m,
}));

// Soma as corridas de cada atleta no dia (pode ter corrido mais de uma vez).
const byAthlete = (runs: readonly ITeamLastRun[]): ITeamRunMember[] => {
	const totals = new Map<string, ITeamLastRun>();
	for (const run of runs) {
		const prev = totals.get(run.userId);
		totals.set(
			run.userId,
			prev
				? {
						...prev,
						km: prev.km + run.km,
						seconds: prev.seconds + run.seconds,
						points: prev.points + run.points,
					}
				: run,
		);
	}
	return [...totals.values()]
		.map((r) => ({
			name: r.name || "Atleta",
			km: r.km,
			pace: formatPace(r.km > 0 ? r.seconds / r.km : 0),
			points: r.points,
			isYou: r.isYou,
		}))
		.sort((a, b) => b.km - a.km);
};

const toView = (
	data: ITeamLastRuns | null,
	team: { name: string; size: number } | null,
): ITeamRunsView => {
	const members = data ? byAthlete(data.runs) : [];
	const label = data?.lastAt ? `${team?.name ?? ""} · ${runDate(new Date(data.lastAt))}` : "";
	return {
		hasTeam: Boolean(team),
		hasRuns: members.length > 0,
		label: team ? label || team.name : "",
		totalKm: members.reduce((sum, m) => sum + m.km, 0),
		totalPoints: members.reduce((sum, m) => sum + m.points, 0),
		ran: members.length,
		size: team?.size ?? 0,
		members,
	};
};

const DEMO_VIEW: ITeamRunsView = {
	hasTeam: true,
	hasRuns: true,
	label: DEMO_LABEL,
	totalKm: DEMO_MEMBERS.reduce((sum, m) => sum + m.km, 0),
	totalPoints: DEMO_MEMBERS.reduce((sum, m) => sum + m.points, 0),
	ran: DEMO_MEMBERS.length,
	size: MY_TEAM.size,
	members: DEMO_MEMBERS,
};

// Última corrida da equipe (Início e detalhe da corrida da equipe).
export const useTeamRuns = (): IUseTeamRunsReturn => {
	const { team } = useMyTeam();
	const query = useQuery({
		queryKey: DATA_KEYS.teamLastRuns,
		queryFn: getTeamLastRuns,
		enabled: !IS_PREVIEW,
	});

	if (IS_PREVIEW) return { view: DEMO_VIEW, isLoading: false };
	return { view: toView(query.data ?? null, team), isLoading: query.isLoading };
};
