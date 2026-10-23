import { Platform } from "react-native";

import type { LocationObject } from "expo-location";
import * as TaskManager from "expo-task-manager";

import { IRunPoint } from "./geo";
import { useRunStore } from "./runStore";

export const RUN_LOCATION_TASK = "pace-team-run-location";

export const toRunPoint = (location: LocationObject): IRunPoint => ({
	lat: location.coords.latitude,
	lng: location.coords.longitude,
	t: location.timestamp,
	accuracy: location.coords.accuracy ?? undefined,
});

// Tarefa registrada na abertura do app: recebe os pontos do GPS mesmo com a
// tela bloqueada e soma à corrida em andamento.
if (Platform.OS !== "web") {
	TaskManager.defineTask<{ locations?: LocationObject[] }>(RUN_LOCATION_TASK, ({ data, error }) => {
		if (error || !data.locations) return Promise.resolve();
		useRunStore.getState().addLocations(data.locations.map(toRunPoint));
		return Promise.resolve();
	});
}
