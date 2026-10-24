import { useCallback } from "react";

import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { IViradaContribution, IViradaView, useNotificationFeed, useVirada } from "@/lib/data";
import { useTabRail } from "@/lib/hooks/useTabRail";
import { IViradaState, VIRADA } from "@/lib/pace";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { HERO_TITLES } from "../constants";

export type IContribution = IViradaContribution;

interface IUseViradaScreenReturn {
	virada: IViradaView | null;
	hasTeam: boolean;
	isLoading: boolean;
	hasNotifications: boolean;
	isDone: boolean;
	// Simulador de estados e etiqueta "demonstração": só na prévia por link
	isPreview: boolean;
	title: { start: string; highlight: string };
	closesIn: string;
	toast: IFloatingToastData | null;
	changeState: (value: string) => void;
	goBack: () => void;
	goRun: () => void;
	goRanking: () => void;
	goTeam: () => void;
	goNotifications: () => void;
	onRailChange: (tabId: string) => void;
}

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;

// Tempo até o ranking fechar (domingo 23:59): "2d 14h"
const closesInLabel = (now = new Date()): string => {
	const daysToSunday = (7 - now.getDay()) % 7;
	const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysToSunday, 23, 59, 59);
	const left = Math.max(0, end.getTime() - now.getTime());
	return `${String(Math.floor(left / DAY_MS))}d ${String(Math.floor((left % DAY_MS) / HOUR_MS))}h`;
};

// Disputa com o rival logo à frente no ranking da cidade: placar, ranking e contribuição.
export const useViradaScreen = (): IUseViradaScreenReturn => {
	const router = useRouter();
	const onRailChange = useTabRail();
	const { virada, hasTeam, isLoading } = useVirada();
	const { hasItems } = useNotificationFeed();
	const setViradaState = useStore((s) => s.setViradaState);
	const { toast, showToast } = useFloatingToast();
	const state: IViradaState = virada?.state ?? "equal";

	const changeState = useCallback(
		(value: string) => {
			const next = value as IViradaState;
			if (next === state) return;
			setViradaState(next);
			const s = VIRADA[next];
			showToast({ tone: s.tone, icon: s.icon, title: s.label, message: s.msg });
		},
		[state, setViradaState, showToast],
	);

	return {
		virada,
		hasTeam,
		isLoading,
		hasNotifications: hasItems,
		isDone: state === "done",
		isPreview: IS_PREVIEW,
		title: virada?.title ?? HERO_TITLES[state],
		closesIn: closesInLabel(),
		toast,
		changeState,
		goBack: () => {
			if (router.canGoBack()) router.back();
			else router.replace(ROUTES.HOME);
		},
		goRun: () => {
			router.navigate(ROUTES.RUN);
		},
		goRanking: () => {
			router.navigate(ROUTES.RANKING);
		},
		goTeam: () => {
			router.navigate(ROUTES.TEAM);
		},
		goNotifications: () => {
			router.push(ROUTES.NOTIFICATIONS);
		},
		onRailChange,
	};
};
