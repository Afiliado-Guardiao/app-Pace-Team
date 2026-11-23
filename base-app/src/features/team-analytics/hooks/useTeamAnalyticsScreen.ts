import { useMemo } from "react";

import { useRouter } from "expo-router";

import { useTeamAnalytics } from "@/lib/data";
import { useProGate } from "@/lib/pro";
import { ITeamAnalytics } from "@/lib/supabase";
import { ROUTES } from "@/constants/routes";

import { analyticsView, IAnalyticsView } from "../utils/analyticsView";

interface IUseTeamAnalyticsScreenReturn {
	data: ITeamAnalytics | null;
	view: IAnalyticsView | null;
	// Sem Team Pro: mostra a vitrine dos relatórios em vez dos números
	isLocked: boolean;
	isLoading: boolean;
	isError: boolean;
	teamKm: number;
	retry: () => void;
	goBack: () => void;
	openPro: () => void;
}

// Team Analytics: números reais da equipe (só para quem tem o Team Pro)
export const useTeamAnalyticsScreen = (): IUseTeamAnalyticsScreenReturn => {
	const router = useRouter();
	const gate = useProGate("analytics");
	const isProLoading = gate.isLoading;
	const isLocked = !isProLoading && !gate.isPro;
	const { data, isLoading, isError, refresh } = useTeamAnalytics();
	const view = useMemo(() => (data ? analyticsView(data) : null), [data]);

	return {
		data,
		view,
		isLocked,
		isLoading: isLoading || isProLoading,
		isError: isError && !isLocked,
		teamKm: data?.weeks.at(-1)?.km ?? 0,
		retry: refresh,
		goBack: () => {
			gate.leave();
			if (router.canGoBack()) router.back();
			else router.replace(ROUTES.HOME);
		},
		openPro: gate.ask,
	};
};
