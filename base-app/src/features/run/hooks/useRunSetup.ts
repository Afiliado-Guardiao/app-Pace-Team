import { useCallback, useEffect, useState } from "react";

import { useFocusEffect, useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import {
	currentFix,
	IRunGoal,
	IRunMode,
	requestRunPermission,
	startTracking,
	useRunStore,
} from "@/lib/run";
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
	const [gps, setGps] = useState<IGpsState>("searching");
	const [accuracy, setAccuracy] = useState(0);
	const [position, setPosition] = useState<readonly [number, number] | null>(null);

	// Corrida em andamento (app reaberto no meio): volta direto para ela
	useFocusEffect(
		useCallback(() => {
			if (status !== "idle") router.push(ROUTES.RUN_LIVE);
		}, [status, router]),
	);

	useEffect(() => {
		let active = true;
		// Função (e não a variável) para o TS não "fixar" o valor entre os awaits
		const isCancelled = (): boolean => !active;
		const locate = async (): Promise<void> => {
			const permission = await requestRunPermission();
			if (isCancelled()) return;
			if (permission === "denied") {
				setGps("denied");
				return;
			}
			const fix = await currentFix();
			if (isCancelled() || !fix) return;
			setPosition([fix.lat, fix.lng]);
			setAccuracy(fix.accuracy);
			setGps("ready");
		};
		locate().catch(() => {
			if (active) setGps("denied");
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
			})
			.catch(() => {
				useRunStore.getState().reset();
				showToast(RUN_TOASTS.error);
			});
	}, [gps, start, router, showToast]);

	return {
		gps,
		accuracy,
		position,
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
