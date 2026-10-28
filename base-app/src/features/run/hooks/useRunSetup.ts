import { useCallback, useEffect, useState } from "react";

import { useFocusEffect, useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import {
	IRunGoal,
	IRunMode,
	requestRunPermission,
	startGpsWatch,
	startTracking,
	useGpsStore,
	useRunStore,
} from "@/lib/run";
import { notifyTeamRunStart, pingTeamOnline } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { RUN_TOASTS } from "../constants";

export type IGpsState = "searching" | "ready" | "denied";

interface IUseRunSetupReturn {
	gps: IGpsState;
	accuracy: number;
	position: readonly [number, number] | null;
	mode: IRunMode;
	goal: IRunGoal;
	toast: IFloatingToastData | null;
	setMode: (mode: IRunMode) => void;
	setGoal: (goal: IRunGoal) => void;
	handleStart: () => void;
	openMap: () => void;
}

// Preparar corrida: pede a localização, mostra a precisão do GPS e inicia.
export const useRunSetup = (): IUseRunSetupReturn => {
	const router = useRouter();
	const { toast, showToast } = useFloatingToast();
	const status = useRunStore((s) => s.status);
	const mode = useRunStore((s) => s.mode);
	const goal = useRunStore((s) => s.goal);
	const setMode = useRunStore((s) => s.setMode);
	const setGoal = useRunStore((s) => s.setGoal);
	const start = useRunStore((s) => s.start);
	const fix = useGpsStore((s) => s.fix);
	const [isDenied, setIsDenied] = useState(false);
	// O GPS fica ligado desde a abertura do app (useGpsWarmup): com uma
	// posição já conhecida, o INICIAR libera na hora
	const gps: IGpsState = isDenied ? "denied" : fix ? "ready" : "searching";

	// Corrida em andamento (app reaberto no meio): volta direto para ela
	useFocusEffect(
		useCallback(() => {
			if (status !== "idle") router.push(ROUTES.RUN_LIVE);
		}, [status, router]),
	);

	useEffect(() => {
		let active = true;
		const locate = async (): Promise<void> => {
			const permission = await requestRunPermission();
			if (!active) return;
			setIsDenied(permission === "denied");
			if (permission === "granted") await startGpsWatch();
		};
		locate().catch(() => {
			if (active) setIsDenied(true);
		});
		return () => {
			active = false;
		};
	}, []);

	const handleStart = useCallback(() => {
		if (gps === "denied") {
			showToast(RUN_TOASTS.denied);
			return;
		}
		if (gps !== "ready") return;
		start();
		startTracking()
			.then(() => {
				router.push(ROUTES.RUN_LIVE);
				// Correndo com a equipe: os colegas recebem "fulano está online" e
				// "sua equipe está correndo, só falta você!"
				if (mode === "team" && !IS_PREVIEW) {
					pingTeamOnline(true).catch(() => undefined);
					notifyTeamRunStart().catch(() => undefined);
				}
			})
			.catch(() => {
				useRunStore.getState().reset();
				showToast(RUN_TOASTS.error);
			});
	}, [gps, start, router, showToast, mode]);

	return {
		gps,
		accuracy: fix?.accuracy ?? 0,
		position: fix ? ([fix.lat, fix.lng] as const) : null,
		mode,
		goal,
		toast,
		setMode,
		setGoal,
		handleStart,
		openMap: () => {
			router.push(ROUTES.MAP);
		},
	};
};
