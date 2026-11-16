import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";

import { useRouter } from "expo-router";

import { useQueryClient } from "@tanstack/react-query";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { DATA_KEYS, ITeamOnlineView, useTeamGame, useTeamOnline } from "@/lib/data";
import { useRunStore } from "@/lib/run";
import { ITeamGame, ITeamGameLevel } from "@/lib/supabase";
import { ROUTES } from "@/constants/routes";

import { GAME_COPY as C } from "../constants";
import { WHEEL_MAX } from "../constants/wheel";

import { useWheelSync } from "./useWheelSync";

export type ITeamGamePhase = "lobby" | "spinning" | "running" | "done";

const errorToast = (err: unknown): IFloatingToastData => {
	const text = err instanceof Error ? err.message : String(err);
	if (text.includes("need_two")) return { tone: "warning", title: C.errNeedTwo };
	if (text.includes("game_active")) return { tone: "warning", title: C.errActive };
	return { tone: "danger", title: C.errGeneric };
};

const phaseOf = (
	game: ITeamGame | null,
	isSpinning: boolean,
	isDismissed: boolean,
): ITeamGamePhase => {
	if (!game || game.status === "cancelled") return "lobby";
	if (isSpinning || game.status === "spinning") return "spinning";
	if (game.status === "running") return "running";
	return isDismissed ? "lobby" : "done";
};

// Roleta da equipe: chamar (com o nível), girar por todos, correr o seu desafio
export const useTeamGameScreen = () => {
	const router = useRouter();
	const client = useQueryClient();
	const { toast, showToast } = useFloatingToast();
	const { game, start, spin, cancel } = useTeamGame(true);
	const { mates } = useTeamOnline();
	const setMode = useRunStore((s) => s.setMode);
	const setGoal = useRunStore((s) => s.setGoal);
	const [level, setLevel] = useState<ITeamGameLevel>("medio");
	const [isBusy, setIsBusy] = useState(false);
	const [isDismissed, setIsDismissed] = useState(false);
	const wheel = useWheelSync(game);
	const phase = phaseOf(game, wheel.isSpinning, isDismissed);
	const settled = useRef<string | null>(null);
	const { width } = useWindowDimensions();
	const wheelSize = Math.min(width - 40, WHEEL_MAX);

	// Roleta fechada: o ranking muda (pontos ganhos ou perdidos)
	useEffect(() => {
		if (game?.status !== "done" || settled.current === game.id) return;
		settled.current = game.id;
		void client.invalidateQueries({ queryKey: DATA_KEYS.rankingAll });
		void client.invalidateQueries({ queryKey: DATA_KEYS.myTeam });
	}, [game, client]);

	const run = useCallback(
		async (task: () => Promise<unknown>) => {
			setIsBusy(true);
			try {
				await task();
			} catch (err) {
				showToast(errorToast(err));
			} finally {
				setIsBusy(false);
			}
		},
		[showToast],
	);

	const handleCall = useCallback(() => {
		void run(async () => {
			await start(
				level,
				mates.map((m: ITeamOnlineView) => m.name),
			);
			setIsDismissed(false);
		});
	}, [run, start, level, mates]);

	const handleSpin = useCallback(() => {
		if (wheel.isSpinning) return;
		void run(spin);
	}, [run, spin, wheel.isSpinning]);

	const handleCancel = useCallback(() => {
		void run(cancel);
	}, [run, cancel]);

	const me = game?.players.find((p) => p.isYou) ?? null;
	const handleRunMine = useCallback(() => {
		if (me?.km == null || me.pace == null) return;
		setMode("team");
		setGoal({ km: me.km, pace: me.pace, min: Math.round((me.km * me.pace) / 60) });
		router.navigate(ROUTES.RUN);
	}, [me, setMode, setGoal, router]);

	return {
		game,
		phase,
		level,
		setLevel,
		mates,
		me,
		wheel,
		wheelSize,
		isBusy,
		toast,
		handleCall,
		handleSpin,
		handleCancel,
		handleRunMine,
		handleAgain: () => {
			setIsDismissed(true);
		},
		goBack: () => {
			router.back();
		},
	};
};
