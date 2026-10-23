import { useMemo, useState } from "react";

import { useRouter } from "expo-router";

import { useMyRuns, useMyStats } from "@/lib/data";
import { formatKm, formatPoints, IRun } from "@/lib/pace";
import { ROUTES } from "@/constants/routes";

import { HISTORY_FILTERS, MONTH_NAMES } from "../constants";

interface IUseHistoryReturn {
	filter: string;
	setFilter: (filter: string) => void;
	runs: readonly IRun[];
	isLoading: boolean;
	isEmpty: boolean;
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

	const runs = useMemo(() => {
		if (filter === "Validadas") return allRuns.filter((r) => r.status === "valid");
		if (filter === "Pendentes") return allRuns.filter((r) => r.status !== "valid");
		return allRuns;
	}, [filter, allRuns]);

	return {
		filter,
		setFilter,
		runs,
		isLoading,
		isEmpty: !isLoading && runs.length === 0,
		month: {
			label: MONTH_NAMES[new Date().getMonth()] ?? "",
			km: formatKm(stats.monthKm, 1),
			runs: String(stats.monthRuns),
			points: formatPoints(stats.monthPoints),
		},
		showInvalidNote: allRuns.some((r) => r.status === "invalid") && filter !== "Validadas",
		openRun: (id) => {
			router.push({ pathname: ROUTES.RUN_DETAIL, params: typeof id === "string" ? { id } : {} });
		},
		goBack: () => {
			if (router.canGoBack()) router.back();
			else router.navigate(ROUTES.PROFILE);
		},
	};
};
