import { useMemo, useState } from "react";

import { useRouter } from "expo-router";

import { useMyRuns, useMyStats, useTeamRunList } from "@/lib/data";
import { formatKm, formatPoints, IRun } from "@/lib/pace";
import { ROUTES } from "@/constants/routes";

import { HISTORY_COPY, HISTORY_FILTERS, MONTH_NAMES, TEAM_FILTER } from "../constants";

interface IUseHistoryReturn {
	filter: string;
	setFilter: (filter: string) => void;
	runs: readonly IRun[];
	isLoading: boolean;
	isEmpty: boolean;
	emptyText: string;
	isTeam: boolean;
	month: { label: string; km: string; runs: string; points: string };
	showInvalidNote: boolean;
	openRun: (id: IRun["id"]) => void;
	goBack: () => void;
}

// 14a Histórico: resumo do mês e corridas (todas, validadas ou pendentes).
export const useHistory = (): IUseHistoryReturn => {
	const router = useRouter();
	const [filter, setFilter] = useState<string>(HISTORY_FILTERS[0]);
	const { runs: allRuns, isLoading } = useMyRuns();
	const { stats } = useMyStats();
	const team = useTeamRunList();
	const isTeam = filter === TEAM_FILTER;

	const runs = useMemo(() => {
		if (isTeam) return team.runs;
		if (filter === "Validadas") return allRuns.filter((r) => r.status === "valid");
		if (filter === "Pendentes") return allRuns.filter((r) => r.status !== "valid");
		return allRuns;
	}, [filter, allRuns, isTeam, team.runs]);
	const isListLoading = isTeam ? team.isLoading : isLoading;

	return {
		filter,
		setFilter,
		runs,
		isLoading: isListLoading,
		isEmpty: !isListLoading && runs.length === 0,
		emptyText: isTeam ? HISTORY_COPY.teamEmpty : HISTORY_COPY.empty,
		isTeam,
		month: {
			label: MONTH_NAMES[new Date().getMonth()] ?? "",
			km: formatKm(stats.monthKm, 1),
			runs: String(stats.monthRuns),
			points: formatPoints(stats.monthPoints),
		},
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
		goBack: () => {
			if (router.canGoBack()) router.back();
			else router.navigate(ROUTES.PROFILE);
		},
	};
};
