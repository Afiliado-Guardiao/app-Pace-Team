import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "expo-router";

import { runPayload, useSaveRun } from "@/lib/data";
import { formatKm, ONLINE } from "@/lib/pace";
import { elapsedSeconds, stopTracking, useRunStore } from "@/lib/run";
import { ROUTES } from "@/constants/routes";

const TICK_MS = 1000;

// Corrida em andamento: relógio, pausa, finalização e atalhos do pós-corrida.
export const useRunLive = () => {
	const router = useRouter();
	const status = useRunStore((s) => s.status);
	const mode = useRunStore((s) => s.mode);
	const points = useRunStore((s) => s.points);
	const meters = useRunStore((s) => s.meters);
	const elapsedBefore = useRunStore((s) => s.elapsedBefore);
	const segmentStart = useRunStore((s) => s.segmentStart);
	const pause = useRunStore((s) => s.pause);
	const resume = useRunStore((s) => s.resume);
	const finish = useRunStore((s) => s.finish);
	const saveRun = useSaveRun();
	const [now, setNow] = useState(Date.now());
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	useEffect(() => {
		const id = setInterval(() => {
			setNow(Date.now());
		}, TICK_MS);
		return () => {
			clearInterval(id);
		};
	}, []);

	const route = useMemo(() => points.map((p) => [p.lat, p.lng] as const), [points]);
	const km = meters / 1000;

	// Modo equipe: amigos posicionados ao longo do mesmo trajeto (simulação do protótipo)
	const friends = useMemo(() => {
		if (mode !== "team" || route.length < 2) return [];
		return ONLINE.map((f) => {
			const at = Math.min(1, Math.max(0, f.pace + f.lead));
			const position = route[Math.round(at * (route.length - 1))] ?? route[0];
			return { position, image: f.image, label: `${formatKm(km * f.pace)} km` };
		});
	}, [mode, route, km]);

	const handleFinish = useCallback(() => {
		setIsConfirmOpen(false);
		const result = finish();
		saveRun.mutate(runPayload(result));
		stopTracking()
			.catch(() => undefined)
			.finally(() => {
				router.replace(ROUTES.RUN_SUMMARY);
			});
	}, [finish, router, saveRun]);

	const openAfterRun = useCallback(
		(route: string) => {
			router.push(route);
		},
		[router],
	);

	return {
		isPaused: status === "paused",
		isTeam: mode === "team",
		seconds: elapsedSeconds({ elapsedBefore, segmentStart }, now),
		km,
		route,
		friends,
		isConfirmOpen,
		pause,
		resume: () => {
			setIsConfirmOpen(false);
			resume();
		},
		openConfirm: () => {
			setIsConfirmOpen(true);
		},
		closeConfirm: () => {
			setIsConfirmOpen(false);
		},
		handleFinish,
		goBack: () => {
			router.navigate(ROUTES.RUN);
		},
		openMap: () => {
			router.push(ROUTES.MAP);
		},
		openShare: () => {
			openAfterRun(ROUTES.RUN_SHARE);
		},
		openPost: () => {
			openAfterRun(ROUTES.RUN_POST);
		},
	};
};
