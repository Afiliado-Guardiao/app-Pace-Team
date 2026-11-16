import { useCallback, useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
	cancelTeamGame,
	getTeamGame,
	ITeamGame,
	ITeamGameLevel,
	ITeamGameSpin,
	spinTeamGame,
	startTeamGame,
} from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";
import { demoSpinGame, demoStartGame } from "./teamGameDemo";

interface IUseTeamGameReturn {
	game: ITeamGame | null;
	isLoading: boolean;
	start: (level: ITeamGameLevel, demoNames?: readonly string[]) => Promise<ITeamGame | null>;
	spin: () => Promise<ITeamGameSpin | null>;
	cancel: () => Promise<void>;
	refetch: () => void;
}

// Na tela da roleta, quase ao vivo (os outros veem os giros de quem chamou)
const LIVE_MS = 3_000;
const IDLE_MS = 20_000;

// Roleta da equipe: a ativa (ou a última fechada) e as ações de quem chamou
export const useTeamGame = (isLive = false): IUseTeamGameReturn => {
	const client = useQueryClient();
	const [demo, setDemo] = useState<ITeamGame | null>(null);
	const query = useQuery({
		queryKey: DATA_KEYS.teamGame,
		queryFn: getTeamGame,
		enabled: !IS_PREVIEW,
		refetchInterval: isLive ? LIVE_MS : IDLE_MS,
	});
	const game = IS_PREVIEW ? demo : (query.data ?? null);

	const save = useCallback(
		(next: ITeamGame | null) => {
			if (IS_PREVIEW) setDemo(next);
			else client.setQueryData(DATA_KEYS.teamGame, next);
		},
		[client],
	);

	const start = useCallback(
		async (level: ITeamGameLevel, demoNames: readonly string[] = []) => {
			const next = IS_PREVIEW ? demoStartGame(level, demoNames) : await startTeamGame(level);
			save(next);
			return next;
		},
		[save],
	);

	const spin = useCallback(async () => {
		if (!game) return null;
		const result = IS_PREVIEW ? demoSpinGame(game) : await spinTeamGame(game.id);
		if (result) save(result.game);
		return result;
	}, [game, save]);

	const cancel = useCallback(async () => {
		if (!game) return;
		save(IS_PREVIEW ? null : await cancelTeamGame(game.id));
	}, [game, save]);

	const refetchQuery = query.refetch;
	const refetch = useCallback(() => {
		void refetchQuery();
	}, [refetchQuery]);

	return { game, isLoading: query.isLoading && !IS_PREVIEW, start, spin, cancel, refetch };
};
