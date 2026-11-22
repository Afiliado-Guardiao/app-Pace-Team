import { useCallback, useEffect } from "react";

import * as Haptics from "expo-haptics";
import { useRouter, useSegments } from "expo-router";

import { useTeamGame } from "@/lib/data";
import { formatPace } from "@/lib/pace";
import { useRunStore } from "@/lib/run";
import { ITeamGamePlayer } from "@/lib/supabase";
import { ROUTES } from "@/constants/routes";

import { useSeenGamesStore } from "./seenStore";

export interface IInviteRow {
	id: string;
	name: string;
	challenge: string;
	isYou: boolean;
}

interface IUseTeamGameInviteReturn {
	isOpen: boolean;
	starter: string;
	mine: string;
	rows: IInviteRow[];
	accept: () => void;
	watch: () => void;
	close: () => void;
}

const challengeOf = (p: ITeamGamePlayer): string =>
	p.km != null && p.pace != null ? `${String(p.km)} km · pace ${formatPace(p.pace)}/km` : "—";

// Convite da roleta: quem chamou girou e sorteou um desafio para você. O
// pop-up aparece uma vez por roleta (com o app aberto), com o desafio de
// todo mundo; aceitar já abre a corrida com a sua meta (km e pace)
export const useTeamGameInvite = (): IUseTeamGameInviteReturn => {
	const router = useRouter();
	const segments = useSegments();
	const { game } = useTeamGame();
	const seen = useSeenGamesStore((s) => s.ids);
	const markSeen = useSeenGamesStore((s) => s.markSeen);
	const setMode = useRunStore((s) => s.setMode);
	const setGoal = useRunStore((s) => s.setGoal);

	const me = game?.players.find((p) => p.isYou) ?? null;
	// Na tela da roleta já dá para ver; correndo, o pop-up não pode atrapalhar
	const screen = segments.at(-1);
	const isBusy = screen === "team-game" || screen === "run-live";
	const isOpen =
		!!game &&
		game.status === "running" &&
		!game.isStarter &&
		me?.status === "pending" &&
		me.km != null &&
		!seen.includes(game.id) &&
		!isBusy;

	// Abriu a roleta (pela notificação ou pelo app): o convite já foi visto
	const gameId = game?.id;
	useEffect(() => {
		if (screen === "team-game" && gameId) markSeen(gameId);
	}, [screen, gameId, markSeen]);

	const done = useCallback(() => {
		if (game) markSeen(game.id);
	}, [game, markSeen]);

	const accept = useCallback(() => {
		done();
		if (me?.km == null || me.pace == null) return;
		void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
		setMode("team");
		setGoal({ km: me.km, pace: me.pace, min: Math.round((me.km * me.pace) / 60) });
		router.navigate(ROUTES.RUN);
	}, [done, me, setMode, setGoal, router]);

	const watch = useCallback(() => {
		done();
		router.push(ROUTES.TEAM_GAME);
	}, [done, router]);

	return {
		isOpen,
		starter: game?.starterName ?? "",
		mine: me ? challengeOf(me) : "",
		rows: (game?.players ?? []).map((p) => ({
			id: p.userId,
			name: p.isYou ? "Você" : p.name,
			challenge: challengeOf(p),
			isYou: p.isYou,
		})),
		accept,
		watch,
		close: done,
	};
};
