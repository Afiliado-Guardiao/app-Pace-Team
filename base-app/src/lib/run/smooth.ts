import { IRunPoint } from "./geo";

// Suavização do GPS (filtro de Kalman simples, o mesmo do Buddy em Swift):
// cada ponto novo puxa a posição só na proporção da confiança dele. Andando
// devagar, o sinal oscilando 10–40 m para os lados deixa de desenhar
// zigue-zague e de somar distância que não existiu.
export const KALMAN = {
	// Quanto a posição real pode mudar por segundo (m²/s)
	processNoise: 4,
	// Precisão mínima considerada (m), mesmo quando o GPS promete melhor
	minAccuracy: 3,
} as const;

const varianceOf = (point: IRunPoint): number => {
	const accuracy = Math.max(KALMAN.minAccuracy, point.accuracy ?? 10);
	return accuracy * accuracy;
};

// Ponto suavizado a partir do último aceito (sem anterior: começa nele)
export const smoothPoint = (prev: IRunPoint | undefined, raw: IRunPoint): IRunPoint => {
	const r = varianceOf(raw);
	if (!prev || prev.variance === undefined) return { ...raw, variance: r };
	const seconds = Math.max(0, (raw.t - prev.t) / 1000);
	const p = prev.variance + KALMAN.processNoise * seconds;
	const k = p / (p + r);
	return {
		...raw,
		lat: prev.lat + k * (raw.lat - prev.lat),
		lng: prev.lng + k * (raw.lng - prev.lng),
		variance: (1 - k) * p,
	};
};
