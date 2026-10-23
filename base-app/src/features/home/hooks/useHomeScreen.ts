import { useCallback } from "react";

import { useRouter } from "expo-router";

import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

import { IStackCardId } from "./useHomeStack";

interface IUseHomeScreenReturn {
	userName: string;
	openProfile: () => void;
	openNotifications: () => void;
	openTeam: () => void;
	openStackCard: (id: IStackCardId) => void;
}

const FALLBACK_NAME = "Lucas Moreira";

// Navegação do Início (perfil, notificações, equipe, Modo Virada, corrida da equipe).
export const useHomeScreen = (): IUseHomeScreenReturn => {
	const router = useRouter();
	const user = useStore((state) => state.user);
	const setHasSeenVirada = useStore((state) => state.setHasSeenVirada);

	const openProfile = useCallback(() => {
		router.navigate(ROUTES.PROFILE);
	}, [router]);
	const openNotifications = useCallback(() => {
		router.push(ROUTES.NOTIFICATIONS);
	}, [router]);
	const openTeam = useCallback(() => {
		router.navigate(ROUTES.TEAM);
	}, [router]);
	const openStackCard = useCallback(
		(id: IStackCardId) => {
			if (id === "virada") {
				setHasSeenVirada(true);
				router.push(ROUTES.VIRADA);
				return;
			}
			router.push({ pathname: ROUTES.RUN_DETAIL, params: { mode: "team" } });
		},
		[router, setHasSeenVirada],
	);

	return {
		userName: user?.name || FALLBACK_NAME,
		openProfile,
		openNotifications,
		openTeam,
		openStackCard,
	};
};
