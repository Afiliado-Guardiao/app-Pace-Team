// Geometria e filtros do GPS da corrida.

export interface IRunPoint {
	lat: number;
	lng: number;
	// epoch ms
	t: number;
	accuracy?: number;
	// true = primeiro ponto depois de uma pausa (não soma distância até ele)
	resume?: boolean;
}

const EARTH_RADIUS_M = 6371000;
const toRad = (deg: number): number => (deg * Math.PI) / 180;

// Distância em metros entre dois pontos (haversine)
export const distanceMeters = (a: IRunPoint, b: IRunPoint): number => {
	const dLat = toRad(b.lat - a.lat);
	const dLng = toRad(b.lng - a.lng);
	const h =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
	return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
};

export const GPS_FILTER = {
	// Precisão pior que isso é descartada (m)
	maxAccuracy: 20,
	// Ritmo humano máximo de corrida: ~32 km/h (m/s)
	maxSpeed: 9,
	// Movimento mínimo para contar (evita "tremer" parado) (m)
	minStep: 3,
	// O passo também precisa ser maior que metade do erro do GPS: sem isso,
	// andando devagar, o sinal oscilando desenha bicos e zigue-zagues
	accuracyStep: 0.5,
} as const;

// Aceita o ponto novo? (precisão boa, velocidade humana, movimento real)
export const isValidStep = (prev: IRunPoint, next: IRunPoint): boolean => {
	if ((next.accuracy ?? 0) > GPS_FILTER.maxAccuracy) return false;
	const meters = distanceMeters(prev, next);
	const minStep = Math.max(GPS_FILTER.minStep, (next.accuracy ?? 0) * GPS_FILTER.accuracyStep);
	if (meters < minStep) return false;
	const seconds = Math.max(0.5, (next.t - prev.t) / 1000);
	return meters / seconds <= GPS_FILTER.maxSpeed;
};

// Distância total da rota, ignorando os trechos entre pausa e retomada
export const routeDistance = (points: readonly IRunPoint[]): number => {
	let total = 0;
	for (let i = 1; i < points.length; i++) {
		const prev = points.at(i - 1);
		const next = points.at(i);
		if (prev && next && !next.resume) total += distanceMeters(prev, next);
	}
	return total;
};
