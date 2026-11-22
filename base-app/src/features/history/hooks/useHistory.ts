import { useMemo, useState } from "react";

import { useRouter } from "expo-router";

import { useMyGamePoints, useMyRuns, useMyStats, useRemoveRun, useTeamRunList } from "@/lib/data";
import { IRun } from "@/lib/pace";
import { ROUTES } from "@/constants/routes";

import { HISTORY_COPY, HISTORY_FILTERS, TEAM_FILTER } from "../constants";

import { IGameEntry, useHistoryGames } from "./useHistoryGames";
import { IUseHistoryMonthReturn, useHistoryMonth } from "./useHistoryMonth";

interface IUseHistoryReturn {
	filter: string;
	setFilter: (filter: string) => void;
	runs: readonly IRun[];
	isLoading: boolean;
	isEmpty: boolean;
	emptyText: string;
	isTeam: boolean;
	month: { label: string; km: string; runs: string; points: string };
	// Calendário: escolhe o mês do resumo e da lista
	calendar: IUseHistoryMonthReturn;
	showInvalidNote: boolean;
	// Pontos da roleta: embaixo da corrida do desafio ou soltos no topo
	gameOf: (runId: IRun["id"]) => IGameEntry | null;
	looseGames: IGameEntry[];
	openRun: (id: IRun["id"]) => void;
	// Arrastar para a esquerda exclui (só as minhas corridas, não as da equipe)
	removeRun: (run: IRun) => Promise<boolean>;
	goBack: () => void;
}

// 14a Histórico: resumo do mês e corridas (todas, validadas ou pendentes).
export const useHistory = (): IUseHistoryReturn => {
	const router = useRouter();
	const [filter, setFilter] = useState<string>(HISTORY_FILTERS[0]);
	const { runs: allRuns, saved, isLoading } = useMyRuns();
	const { stats } = useMyStats();
	const team = useTeamRunList();
	const { remove } = useRemoveRun();
	const { games } = useMyGamePoints();
	const calendar = useHistoryMonth(saved, stats, games);
	const isTeam = filter === TEAM_FILTER;

	const runs = useMemo(() => {
		if (isTeam) return team.runs;
		const inMonth = allRuns.filter((r) => calendar.isInMonth(r.id));
		if (filter === "Validadas") return inMonth.filter((r) => r.status === "valid");
		if (filter === "Pendentes") return inMonth.filter((r) => r.status !== "valid");
		return inMonth;
	}, [filter, allRuns, isTeam, team.runs, calendar]);
	const runIds = useMemo(() => runs.map((r) => String(r.id)), [runs]);
	const gameRows = useHistoryGames(calendar.games, runIds);
	const hasGames = !isTeam && filter !== "Pendentes";
	const isListLoading = isTeam ? team.isLoading : isLoading;

	return {
		filter,
		setFilter,
		runs,
		isLoading: isListLoading,
		isEmpty: !isListLoading && runs.length === 0,
		emptyText: isTeam ? HISTORY_COPY.teamEmpty : HISTORY_COPY.empty,
		isTeam,
		month: calendar.summary,
		calendar,
		showInvalidNote:
			!isTeam && allRuns.some((r) => r.status === "invalid") && filter !== "Validadas",
		gameOf: (runId) => (hasGames ? (gameRows.byRun.get(String(runId)) ?? null) : null),
		looseGames: hasGames ? gameRows.loose : [],
		// Corrida da equipe abre pelo id da equipe (pode ser de um colega)
		openRun: (id) => {
			const key = isTeam ? "teamRun" : "id";
			router.push({
				pathname: ROUTES.RUN_DETAIL,
				params: typeof id === "string" ? { [key]: id } : {},
			});
		},
		removeRun: remove,
		goBack: () => {
			if (router.canGoBack()) router.back();
			else router.navigate(ROUTES.PROFILE);
		},
	};
};
