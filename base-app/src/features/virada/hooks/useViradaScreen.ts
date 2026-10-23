import { useCallback, useMemo } from "react";

import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { useTabRail } from "@/lib/hooks/useTabRail";
import {
	IRankedTeam,
	IViradaScenario,
	IViradaState,
	MEMBERS,
	MY_TEAM,
	RIVAL,
	TEAMS,
	VIRADA,
} from "@/lib/pace";
import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

import { MY_TEAM_POINTS_BASE } from "../constants";

export interface IContribution {
	name: string;
	role: string;
	points: number;
	you?: boolean;
}

interface IUseViradaScreenReturn {
	state: IViradaState;
	scenario: IViradaScenario;
	isDone: boolean;
	rows: IRankedTeam[];
	members: IContribution[];
	toast: IFloatingToastData | null;
	changeState: (value: string) => void;
	goBack: () => void;
	goRun: () => void;
	goRanking: () => void;
	goNotifications: () => void;
	onRailChange: (tabId: string) => void;
}

// Ranking da cidade em volta do confronto (o seu time troca de lugar na virada)
const cityRows = (scenario: IViradaScenario, isDone: boolean): IRankedTeam[] => {
	const leader = TEAMS[1] ?? { name: "", city: "", points: 0, km: 0, delta: 0 };
	const us: IRankedTeam = {
		name: MY_TEAM.name,
		city: "Campinas",
		points: scenario.us,
		km: 182,
		delta: isDone ? 1 : 0,
		you: true,
	};
	const rival: IRankedTeam = {
		name: RIVAL.name,
		city: RIVAL.city,
		points: scenario.rival,
		km: 214,
		delta: isDone ? -1 : 0,
	};
	return [{ ...leader, delta: 0 }, ...(isDone ? [us, rival] : [rival, us])];
};

// Disputa com o rival: estado simulado, placar, ranking e contribuição do time.
export const useViradaScreen = (): IUseViradaScreenReturn => {
	const router = useRouter();
	const onRailChange = useTabRail();
	const state = useStore((s) => s.viradaState);
	const setViradaState = useStore((s) => s.setViradaState);
	const { toast, showToast } = useFloatingToast();
	const scenario = VIRADA[state];
	const isDone = state === "done";

	const members = useMemo(() => {
		const scale = scenario.us / MY_TEAM_POINTS_BASE;
		return MEMBERS.map((m) => ({
			name: m.name,
			role: m.role,
			points: Math.round(m.pts * scale),
			you: m.you,
		})).sort((a, b) => b.points - a.points);
	}, [scenario.us]);

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
		state,
		scenario,
		isDone,
		rows: cityRows(scenario, isDone),
		members,
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
		goNotifications: () => {
			router.push(ROUTES.NOTIFICATIONS);
		},
		onRailChange,
	};
};
