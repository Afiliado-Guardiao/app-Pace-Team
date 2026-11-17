import { IHealthWorkout, IWatchRun } from "./types";

// Metros por unidade de distância que o app Saúde pode devolver
const METERS: Record<string, number> = {
	m: 1,
	km: 1000,
	mi: 1609.344,
	ft: 0.3048,
	yd: 0.9144,
	cm: 0.01,
};

// Percurso guardado com no máximo ~400 pontos (o mesmo das corridas do app)
const MAX_ROUTE_POINTS = 400;
const NAME_MAX = 60;

const toKm = (d: IHealthWorkout["distance"]): number => {
	if (!d) return 0;
	const factor = d.unit in METERS ? METERS[d.unit] : 0;
	return (d.quantity * factor) / 1000;
};

const toRoute = (points: IHealthWorkout["route"]): [number, number][] => {
	const step = Math.max(1, Math.ceil(points.length / MAX_ROUTE_POINTS));
	return points
		.filter((_, i) => i % step === 0 || i === points.length - 1)
		.map((p) => [p.latitude, p.longitude]);
};

const cleanHr = (hr: number | null): number | null =>
	hr !== null && hr >= 30 && hr <= 250 ? Math.round(hr) : null;

// Treino do app Saúde → corrida do PACE TEAM. Sem distância não é corrida
// que conte (ex.: esteira sem medição): fica de fora.
export const toWatchRun = (w: IHealthWorkout): IWatchRun | null => {
	const km = toKm(w.distance);
	if (km <= 0 || w.durationSeconds <= 0) return null;
	return {
		externalId: w.uuid,
		startedAt: w.startDate.getTime(),
		finishedAt: w.endDate.getTime(),
		seconds: Math.round(w.durationSeconds),
		km,
		route: toRoute(w.route),
		avgHr: cleanHr(w.avgHr),
		deviceName: w.sourceName ? w.sourceName.slice(0, NAME_MAX) : null,
	};
};

// A partir de quando buscar: do dia em que conectou (corridas antigas não
// entram) ou um pouco antes da última busca (o relógio às vezes manda atrasado)
const RESYNC_MS = 2 * 24 * 60 * 60 * 1000;

export const syncStart = (connectedAt: number, lastSyncAt: number | null): Date => {
	const day = new Date(connectedAt);
	day.setHours(0, 0, 0, 0);
	const from = lastSyncAt ? Math.max(day.getTime(), lastSyncAt - RESYNC_MS) : day.getTime();
	return new Date(from);
};
