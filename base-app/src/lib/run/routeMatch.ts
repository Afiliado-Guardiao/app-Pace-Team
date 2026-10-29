// Percurso repetido: acha a última vez que o atleta fez o mesmo caminho e
// compara o tempo (competir com você mesmo).
import { distanceMeters } from "./geo";

type IPoint = readonly [number, number];

export interface IRouteRun {
	id: string;
	startedAt: string;
	seconds: number;
	km: number;
	route: readonly IPoint[];
}

export interface IRouteComparison {
	previous: IRouteRun;
	// Diferença no tempo, na distância desta corrida (− = mais rápido)
	deltaSeconds: number;
	isFaster: boolean;
	// Segundos por km desta corrida e da anterior
	pace: number;
	previousPace: number;
}

// Mesmo começo e fim (até 80 m), distância parecida (até 20%) e o caminho
// passando perto (até 60 m) em 12 pontos ao longo do trajeto
const ENDS_M = 80;
const PATH_M = 60;
const DISTANCE_TOLERANCE = 0.2;
const SAMPLES = 12;
const MIN_KM = 0.2;
// Diferença menor que isso conta como "mesmo tempo"
const TIE_SECONDS = 2;

const meters = (a: IPoint, b: IPoint): number =>
	distanceMeters({ lat: a[0], lng: a[1], t: 0 }, { lat: b[0], lng: b[1], t: 0 });

const nearRoute = (point: IPoint, route: readonly IPoint[]): boolean =>
	route.some((p) => meters(point, p) <= PATH_M);

export const isSameRoute = (a: IRouteRun, b: IRouteRun): boolean => {
	if (a.route.length < 2 || b.route.length < 2 || a.km < MIN_KM || b.km < MIN_KM) return false;
	if (Math.abs(a.km - b.km) / Math.max(a.km, b.km) > DISTANCE_TOLERANCE) return false;
	const [aStart, aEnd] = [a.route[0], a.route[a.route.length - 1]];
	const [bStart, bEnd] = [b.route[0], b.route[b.route.length - 1]];
	if (meters(aStart, bStart) > ENDS_M || meters(aEnd, bEnd) > ENDS_M) return false;
	for (let i = 1; i < SAMPLES; i++) {
		const point = a.route[Math.floor((i / SAMPLES) * (a.route.length - 1))];
		if (!nearRoute(point, b.route)) return false;
	}
	return true;
};

// Compara com a vez anterior mais recente no mesmo percurso (null = primeira vez)
export const compareWithPrevious = (
	run: IRouteRun,
	history: readonly IRouteRun[],
): IRouteComparison | null => {
	const before = history
		.filter((h) => h.id !== run.id && h.startedAt < run.startedAt)
		.sort((x, y) => (x.startedAt < y.startedAt ? 1 : -1));
	const previous = before.find((h) => isSameRoute(run, h));
	if (!previous || run.km <= 0 || previous.km <= 0) return null;
	const pace = run.seconds / run.km;
	const previousPace = previous.seconds / previous.km;
	const deltaSeconds = Math.round((pace - previousPace) * run.km);
	return {
		previous,
		deltaSeconds: Math.abs(deltaSeconds) < TIE_SECONDS ? 0 : deltaSeconds,
		isFaster: deltaSeconds <= -TIE_SECONDS,
		pace,
		previousPace,
	};
};
