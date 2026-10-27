import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "expo-router";

import { runPayload, useSaveRun, useTeamLive } from "@/lib/data";
import { formatKm, ONLINE } from "@/lib/pace";
import { elapsedSeconds, stopTracking, useGpsStore, useRunStore } from "@/lib/run";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

const TICK_MS = 1000;
// Posição do GPS da tela vale para o ponto do atleta se for recente
const FRESH_FIX_MS = 15_000;

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
	const fix = useGpsStore((s) => s.fix);
	const isFresh = fix !== null && now - fix.t < FRESH_FIX_MS;
	const fixLat = isFresh ? fix.lat : null;
	const fixLng = isFresh ? fix.lng : null;
	// O mapa segue o atleta: posição mais nova do GPS ou a ponta da rota
	const me = useMemo(
		() => (fixLat !== null && fixLng !== null ? ([fixLat, fixLng] as const) : null),
		[fixLat, fixLng],
	);
	const km = meters / 1000;
	const myPhoto = useStore((s) => s.user?.avatarUrl ?? null);

	// Correndo com a equipe: a foto de cada colega anda no mapa, ao vivo
	const liveMates = useTeamLive({
		isActive: mode === "team" && status !== "idle",
		me: me ?? route.at(-1) ?? null,
	});

	// Na prévia por link, amigos de exemplo ao longo do mesmo trajeto (design)
	const friends = useMemo(() => {
		if (!IS_PREVIEW) {
			return liveMates.map((m) => ({
				position: m.position,
				image: m.avatarUrl ? { uri: m.avatarUrl } : undefined,
				name: m.name,
				label: m.name.split(" ")[0] ?? m.name,
			}));
		}
		if (mode !== "team" || route.length < 2) return [];
		return ONLINE.map((f) => {
			const at = Math.min(1, Math.max(0, f.pace + f.lead));
			const position = route[Math.round(at * (route.length - 1))] ?? route[0];
			return { position, image: f.image, label: `${formatKm(km * f.pace)} km` };
		});
	}, [mode, route, km, liveMates]);

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
		me,
		// Correndo com a equipe, a sua foto anda no mapa como a dos colegas
		meImage: mode === "team" && myPhoto ? { uri: myPhoto } : undefined,
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
