import { useCallback } from "react";

import { useRouter } from "expo-router";

import { IRoute, ROUTES } from "@/constants/routes";

import { IPanelSectionId, IProSectionId } from "../constants";

export type IPanelAction = IPanelSectionId | "invite";

// Telas de cada recurso Pro (liberado: abre direto)
const PRO_ROUTES: Record<IProSectionId, IRoute> = {
	ai: ROUTES.PACE_AI,
	hydration: ROUTES.HYDRATION,
	studio: ROUTES.BUDDY_STUDIO,
	analytics: ROUTES.PRO_ANALYTICS,
};

const isProId = (id: IPanelAction): id is IProSectionId => id in PRO_ROUTES;

// Para onde cada atalho do painel leva (as abas trocam; o resto empilha)
const ROUTE_OF: Partial<Record<IPanelAction, IRoute>> = {
	run: ROUTES.RUN,
	wheel: ROUTES.TEAM_GAME,
	ranking: ROUTES.RANKING,
	team: ROUTES.TEAM,
	invite: ROUTES.INVITE,
};

const TABS: readonly IRoute[] = [ROUTES.RUN, ROUTES.RANKING, ROUTES.TEAM];

// Abre a tela do atalho. Recurso Pro abre sempre: sem o Pro a tela é uma
// vitrine e usar abre a janela do Team Pro
export const usePanelActions = (): { open: (id: IPanelAction) => void } => {
	const router = useRouter();
	const open = useCallback(
		(id: IPanelAction) => {
			if (isProId(id)) {
				router.push(PRO_ROUTES[id]);
				return;
			}
			const route = ROUTE_OF[id];
			if (!route) return;
			if (TABS.includes(route)) router.navigate(route);
			else router.push(route);
		},
		[router],
	);

	return { open };
};
