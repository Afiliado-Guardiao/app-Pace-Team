import { useMemo, useState } from "react";

import { useRouter } from "expo-router";

import { useMyRuns, useMyStats, useRemoveRun, useTeamRunList } from "@/lib/data";
import { IRun } from "@/lib/pace";
import { ROUTES } from "@/constants/routes";

import { HISTORY_COPY, HISTORY_FILTERS, TEAM_FILTER } from "../constants";

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
	const calendar = useHistoryMonth(saved, stats);
	const isTeam = filter === TEAM_FILTER;

	const runs = useMemo(() => {
		if (isTeam) return team.runs;
		const inMonth = allRuns.filter((r) => calendar.isInMonth(r.id));
		if (filter === "Validadas") return inMonth.filter((r) => r.status === "valid");
		if (filter === "Pendentes") return inMonth.filter((r) => r.status !== "valid");
		return inMonth;
	}, [filter, allRuns, isTeam, team.runs, calendar]);
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
