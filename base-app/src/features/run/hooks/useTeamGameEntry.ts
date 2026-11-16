import { useCallback } from "react";

import { useRouter } from "expo-router";

import { useTeamGame } from "@/lib/data";
import { ROUTES } from "@/constants/routes";

import { RUN_COPY } from "../constants";

interface IUseTeamGameEntryReturn {
	label: string;
	isLive: boolean;
	open: () => void;
}

// "Jogar com a equipe": abre a roleta (ou entra na que já está rolando)
export const useTeamGameEntry = (): IUseTeamGameEntryReturn => {
	const router = useRouter();
	const { game } = useTeamGame();
	const isLive = game?.status === "spinning" || game?.status === "running";
	const open = useCallback(() => {
		router.push(ROUTES.TEAM_GAME);
	}, [router]);
	return { label: isLive ? RUN_COPY.gameLive : RUN_COPY.game, isLive, open };
};
