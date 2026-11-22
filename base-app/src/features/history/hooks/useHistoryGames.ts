import { useMemo } from "react";

import { gamePointsText } from "@/components/core/TeamGameResult";
import { formatDuration } from "@/lib/pace";
import { IGamePoints } from "@/lib/supabase";

import { HISTORY_COPY as C } from "../constants";

export interface IGameEntry {
	id: string;
	isLoss: boolean;
	title: string;
	detail: string;
	points: string;
}

interface IUseHistoryGamesReturn {
	// Roleta da corrida (aparece embaixo dela)
	byRun: ReadonlyMap<string, IGameEntry>;
	// Sem corrida na lista (ex.: não correu no prazo): aparece no topo
	loose: IGameEntry[];
}

const toEntry = (g: IGamePoints): IGameEntry => {
	const goal =
		g.km != null && g.pace != null
			? `${C.gameGoal} ${String(g.km)} km em até ${formatDuration(g.km * g.pace)}`
			: "";
	return {
		id: g.gameId,
		isLoss: g.points < 0,
		title: g.status === "done" ? C.gameDone : C.gameFailed,
		detail: goal,
		points: gamePointsText(g.points),
	};
};

// Pontos da roleta no período do Histórico, ligados à corrida do desafio
export const useHistoryGames = (
	games: readonly IGamePoints[],
	runIds: readonly string[],
): IUseHistoryGamesReturn =>
	useMemo(() => {
		const shown = new Set(runIds);
		const byRun = new Map<string, IGameEntry>();
		const loose: IGameEntry[] = [];
		for (const g of games) {
			if (g.runId && shown.has(g.runId)) byRun.set(g.runId, toEntry(g));
			else loose.push(toEntry(g));
		}
		return { byRun, loose };
	}, [games, runIds]);
