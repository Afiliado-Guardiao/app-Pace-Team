import { useCallback } from "react";

import { useRouter } from "expo-router";

import { useMyPro } from "@/lib/data";
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

// Abre a tela do atalho. Recurso Pro sem o Pro: a apresentação do recurso
export const usePanelActions = (): { open: (id: IPanelAction) => void } => {
	const router = useRouter();
	const { isPro } = useMyPro();

	const open = useCallback(
		(id: IPanelAction) => {
			if (isProId(id)) {
				// Studio e Analytics abrem sempre: sem o Pro dá para ver, e usar pede
				// a assinatura dentro da tela
				if (isPro || id === "studio" || id === "analytics") router.push(PRO_ROUTES[id]);
				else router.push({ pathname: ROUTES.PRO_FEATURE, params: { id } });
				return;
			}
			const route = ROUTE_OF[id];
			if (!route) return;
			if (TABS.includes(route)) router.navigate(route);
			else router.push(route);
		},
		[router, isPro],
	);

	return { open };
};
