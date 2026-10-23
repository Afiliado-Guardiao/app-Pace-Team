import { useMyStats, useMyTeam } from "@/lib/data";
import { formatKm, formatPoints } from "@/lib/pace";

import { HOME_COPY, WEEK_PROGRESS } from "../constants";

export interface IWeekSummary {
	km: number;
	goal: number;
	display: string;
	points: string;
	teamFirst: string;
	teamRest: string;
	rank: string;
}

// "Sua semana" do Início: km da semana, meus pontos e a posição do time.
export const useWeekSummary = (): IWeekSummary => {
	const { stats } = useMyStats();
	const { team } = useMyTeam();
	const [first = HOME_COPY.noTeamA, ...rest] = (team?.name ?? "").split(" ").filter(Boolean);

	return {
		km: stats.weekKm,
		goal: WEEK_PROGRESS.goal,
		display: formatKm(stats.weekKm, 1),
		points: formatPoints(stats.weekPoints),
		teamFirst: first,
		teamRest: team ? rest.join(" ") : HOME_COPY.noTeamB,
		rank: team ? `${String(team.position)}º` : "–",
	};
};
