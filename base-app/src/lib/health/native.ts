import {
	isHealthDataAvailable,
	queryWorkoutSamples,
	requestAuthorization,
	WorkoutActivityType,
	WorkoutProxyTyped,
	WorkoutRouteTypeIdentifier,
	WorkoutTypeIdentifier,
} from "@kingstinct/react-native-healthkit";

import { IHealthWorkout } from "./types";

const HEART_RATE = "HKQuantityTypeIdentifierHeartRate";
// Só leitura: o PACE TEAM não escreve nada no app Saúde
const READ = [
	WorkoutTypeIdentifier,
	WorkoutRouteTypeIdentifier,
	HEART_RATE,
	"HKQuantityTypeIdentifierDistanceWalkingRunning",
] as const;

const SECONDS: Record<string, number> = { s: 1, ms: 0.001, min: 60, hr: 3600, h: 3600 };

// Busca até este tanto de treinos por vez (dá e sobra para alguns dias)
const MAX_WORKOUTS = 60;

export const isHealthAvailable = (): boolean => {
	try {
		return isHealthDataAvailable();
	} catch {
		return false;
	}
};

// Abre a tela da Apple para o corredor liberar as corridas. A Apple não conta
// se ele negou (privacidade): o app só percebe que não vem nenhuma corrida.
export const askHealthAccess = async (): Promise<boolean> => {
	if (!isHealthAvailable()) return false;
	return requestAuthorization({ toRead: READ });
};

const avgHrOf = async (w: WorkoutProxyTyped): Promise<number | null> => {
	try {
		const stat = await w.getStatistic(HEART_RATE, "count/min");
		return stat?.averageQuantity?.quantity ?? null;
	} catch {
		return null;
	}
};

const routeOf = async (w: WorkoutProxyTyped): Promise<IHealthWorkout["route"]> => {
	try {
		const routes = await w.getWorkoutRoutes();
		return routes.flatMap((r) => r.locations);
	} catch {
		return [];
	}
};

const toPlain = async (w: WorkoutProxyTyped): Promise<IHealthWorkout> => ({
	uuid: w.uuid,
	startDate: w.startDate,
	endDate: w.endDate,
	// Tempo em movimento (sem as pausas), como nas corridas do app
	durationSeconds:
		w.duration.quantity * (SECONDS[w.duration.unit] ?? 1) ||
		(w.endDate.getTime() - w.startDate.getTime()) / 1000,
	distance: w.totalDistance
		? { quantity: w.totalDistance.quantity, unit: w.totalDistance.unit }
		: null,
	avgHr: await avgHrOf(w),
	sourceName: w.sourceRevision.source.name || null,
	route: await routeOf(w),
});

// Corridas (e só corridas) salvas no app Saúde a partir de `since`
export const fetchRunningWorkouts = async (since: Date): Promise<IHealthWorkout[]> => {
	if (!isHealthAvailable()) return [];
	const workouts = await queryWorkoutSamples({
		limit: MAX_WORKOUTS,
		ascending: true,
		filter: {
			workoutActivityType: WorkoutActivityType.running,
			date: { startDate: since },
		},
	});
	const plain: IHealthWorkout[] = [];
	for (const w of workouts) plain.push(await toPlain(w));
	return plain;
};
