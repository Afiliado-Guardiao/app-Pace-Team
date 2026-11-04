import { Platform } from "react-native";

import type { LocationObject } from "expo-location";
import * as TaskManager from "expo-task-manager";

import { setLivePosition } from "@/lib/supabase/teamRuns";

import { IRunPoint } from "./geo";
import { useGpsStore } from "./gps";
import { useRunStore } from "./runStore";

export const RUN_LOCATION_TASK = "pace-team-run-location";

export const toRunPoint = (location: LocationObject): IRunPoint => ({
	lat: location.coords.latitude,
	lng: location.coords.longitude,
	t: location.timestamp,
	accuracy: location.coords.accuracy ?? undefined,
});

// Correndo com a equipe, a posição ao vivo sai no máximo a cada 5 s
const LIVE_EVERY_MS = 5000;
let liveSentAt = 0;

const shareLivePosition = (point: IRunPoint): void => {
	const run = useRunStore.getState();
	if (run.mode !== "team" || run.status === "idle") return;
	if (Date.now() - liveSentAt < LIVE_EVERY_MS) return;
	liveSentAt = Date.now();
	setLivePosition(point.lat, point.lng, run.meters).catch(() => undefined);
};

// Tarefa registrada na abertura do app: recebe os pontos do GPS mesmo com a
// tela bloqueada, soma à corrida em andamento e mantém a posição do atleta
// (no mapa e para a equipe) sempre a mais nova.
if (Platform.OS !== "web") {
	TaskManager.defineTask<{ locations?: LocationObject[] }>(RUN_LOCATION_TASK, ({ data, error }) => {
		if (error || !data.locations) return Promise.resolve();
		const points = data.locations.map(toRunPoint);
		useRunStore.getState().addLocations(points);
		const last = points.at(-1);
		if (last) {
			useGpsStore.getState().setFix({
				lat: last.lat,
				lng: last.lng,
				accuracy: Math.round(last.accuracy ?? 0),
				t: last.t,
			});
			shareLivePosition(last);
		}
		return Promise.resolve();
	});
}
