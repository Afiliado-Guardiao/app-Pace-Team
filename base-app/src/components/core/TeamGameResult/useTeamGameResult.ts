import { useEffect } from "react";

import { useSegments } from "expo-router";

import { useQueryClient } from "@tanstack/react-query";

import { DATA_KEYS, useTeamGame } from "@/lib/data";
import { ITeamGame, pushTeamGameResult } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { useSeenGamesStore } from "../TeamGameInvite/seenStore";

import { useGameResultStore } from "./resultStore";

interface IUseTeamGameResultReturn {
	game: ITeamGame | null;
	close: () => void;
}

const seenKey = (id: string): string => `result-${id}`;
// Contas que mudam quando a roleta fecha (pontos ganhos ou perdidos)
const CHANGED = [
	DATA_KEYS.myStats,
	DATA_KEYS.gamePoints,
	DATA_KEYS.myTeam,
	DATA_KEYS.rankingAll,
	DATA_KEYS.virada,
] as const;

// Resultado da roleta: quando todos terminam (ou o prazo acaba), o pop-up abre
// sozinho uma vez para quem jogou, em qualquer tela menos correndo. Quem vê
// primeiro pede ao servidor para avisar os outros no celular (uma vez só).
export const useTeamGameResult = (): IUseTeamGameResultReturn => {
	const client = useQueryClient();
	const isRunning = useSegments().at(-1) === "run-live";
	const { game: current } = useTeamGame();
	const seen = useSeenGamesStore((s) => s.ids);
	const markSeen = useSeenGamesStore((s) => s.markSeen);
	const { game, show, close } = useGameResultStore();

	useEffect(() => {
		if (current?.status !== "done" || isRunning) return;
		if (!current.players.some((p) => p.isYou) || seen.includes(seenKey(current.id))) return;
		markSeen(seenKey(current.id));
		show(current);
		CHANGED.forEach((queryKey) => {
			void client.invalidateQueries({ queryKey });
		});
		if (!IS_PREVIEW) pushTeamGameResult(current.id).catch(() => undefined);
	}, [current, isRunning, seen, markSeen, show, client]);

	return { game: isRunning ? null : game, close };
};
