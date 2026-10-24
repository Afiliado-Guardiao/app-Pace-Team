import { useCallback } from "react";

import { useRouter } from "expo-router";

import { useNotificationFeed, useTeamRuns, useVirada } from "@/lib/data";
import { ME } from "@/lib/pace";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { IStackCardId } from "./useHomeStack";

interface IUseHomeScreenReturn {
	userName: string;
	avatarUrl?: string;
	hasNotifications: boolean;
	openProfile: () => void;
	openNotifications: () => void;
	openTeam: () => void;
	openStackCard: (id: IStackCardId) => void;
}

// Sem nome no cadastro: "Atleta" (o nome do design só aparece na prévia)
const FALLBACK_NAME = IS_PREVIEW ? ME.name : "Atleta";

// Navegação do Início (perfil, notificações, equipe, Modo Virada, corrida da equipe).
export const useHomeScreen = (): IUseHomeScreenReturn => {
	const router = useRouter();
	const user = useStore((state) => state.user);
	const setHasSeenVirada = useStore((state) => state.setHasSeenVirada);
	const { view: teamRuns } = useTeamRuns();
	const { virada, hasTeam } = useVirada();
	const { hasItems } = useNotificationFeed();

	const openProfile = useCallback(() => {
		router.navigate(ROUTES.PROFILE);
	}, [router]);
	const openNotifications = useCallback(() => {
		router.push(ROUTES.NOTIFICATIONS);
	}, [router]);
	const openTeam = useCallback(() => {
		router.navigate(ROUTES.TEAM);
	}, [router]);
	// Sem equipe: aba Equipe. Sem rival: Ranking. Equipe sem corrida: Correr.
	const openStackCard = useCallback(
		(id: IStackCardId) => {
			if (!hasTeam && !teamRuns.hasTeam) {
				router.navigate(ROUTES.TEAM);
				return;
			}
			if (id === "virada") {
				setHasSeenVirada(true);
				router.push(virada ? ROUTES.VIRADA : ROUTES.RANKING);
				return;
			}
			if (!teamRuns.hasRuns) {
				router.navigate(ROUTES.RUN);
				return;
			}
			router.push({ pathname: ROUTES.RUN_DETAIL, params: { mode: "team" } });
		},
		[router, setHasSeenVirada, hasTeam, teamRuns.hasTeam, teamRuns.hasRuns, virada],
	);

	return {
		userName: user?.name || FALLBACK_NAME,
		avatarUrl: user?.avatarUrl ?? undefined,
		hasNotifications: hasItems,
		openProfile,
		openNotifications,
		openTeam,
		openStackCard,
	};
};
