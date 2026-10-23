import { Platform } from "react-native";

import * as Location from "expo-location";

import { ROUTE } from "./demoRoute";
import { distanceMeters, routeDistance } from "./geo";
import { RUN_LOCATION_TASK } from "./locationTask";
import { useRunStore } from "./runStore";

export type ILocationPermission = "granted" | "denied" | "unavailable";

// Pede só "durante o uso". Com o modo de segundo plano do iOS e o indicador
// azul, o GPS continua medindo com a tela bloqueada sem pedir "sempre".
export async function requestRunPermission(): Promise<ILocationPermission> {
	if (Platform.OS === "web") return "unavailable";
	const { status } = await Location.requestForegroundPermissionsAsync();
	return status === Location.PermissionStatus.GRANTED ? "granted" : "denied";
}

let simulation: ReturnType<typeof setInterval> | null = null;
const SIMULATION_STEP_MS = 1000;
// Velocidade simulada na prévia: 4 m/s (ritmo de 4'10"/km), dentro do filtro de GPS
const SIMULATION_SPEED = 4;

const ROUTE_POINTS = ROUTE.map(([lat, lng]) => ({ lat, lng, t: 0 }));
const ROUTE_LENGTH = routeDistance(ROUTE_POINTS);

// Ponto a `meters` do início da volta de exemplo (interpolado entre os pontos)
const pointAlongRoute = (meters: number): readonly [number, number] | null => {
	let left = meters % ROUTE_LENGTH;
	for (let i = 1; i < ROUTE.length; i++) {
		const a = ROUTE.at(i - 1);
		const b = ROUTE.at(i);
		if (!a || !b) continue;
		const step = distanceMeters({ lat: a[0], lng: a[1], t: 0 }, { lat: b[0], lng: b[1], t: 0 });
		if (left <= step) {
			const f = step ? left / step : 0;
			return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
		}
		left -= step;
	}
	return ROUTE.at(-1) ?? null;
};

// Na prévia web não há GPS de verdade: percorre a rota de exemplo do design.
function startSimulation(): void {
	let covered = 0;
	simulation = setInterval(() => {
		covered += SIMULATION_SPEED * (SIMULATION_STEP_MS / 1000);
		const point = pointAlongRoute(covered);
		if (!point) return;
		useRunStore
			.getState()
			.addLocations([{ lat: point[0], lng: point[1], t: Date.now(), accuracy: 4 }]);
	}, SIMULATION_STEP_MS);
}

export async function startTracking(): Promise<void> {
	if (Platform.OS === "web") {
		startSimulation();
		return;
	}
	const running = await Location.hasStartedLocationUpdatesAsync(RUN_LOCATION_TASK);
	if (running) return;
	await Location.startLocationUpdatesAsync(RUN_LOCATION_TASK, {
		accuracy: Location.Accuracy.BestForNavigation,
		activityType: Location.ActivityType.Fitness,
		distanceInterval: 5,
		pausesUpdatesAutomatically: false,
		showsBackgroundLocationIndicator: true,
		foregroundService: {
			notificationTitle: "PACE TEAM",
			notificationBody: "Corrida em andamento",
			notificationColor: "#FD5A0C",
		},
	});
}

export async function stopTracking(): Promise<void> {
	if (simulation) {
		clearInterval(simulation);
		simulation = null;
	}
	if (Platform.OS === "web") return;
	const running = await Location.hasStartedLocationUpdatesAsync(RUN_LOCATION_TASK);
	if (running) await Location.stopLocationUpdatesAsync(RUN_LOCATION_TASK);
}

// Posição atual com precisão (tela de preparar corrida)
export async function currentFix(): Promise<{ lat: number; lng: number; accuracy: number } | null> {
	if (Platform.OS === "web")
		return { lat: ROUTE[0]?.[0] ?? 0, lng: ROUTE[0]?.[1] ?? 0, accuracy: 4 };
	const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
	return {
		lat: location.coords.latitude,
		lng: location.coords.longitude,
		accuracy: Math.round(location.coords.accuracy ?? 0),
	};
}
