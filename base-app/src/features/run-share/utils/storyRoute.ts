import { ROUTE } from "@/lib/run";

export interface IStoryBox {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface IStoryRoute {
	// Caminho SVG no espaço 1080 × 1920
	d: string;
	start: readonly [number, number];
	// Ponto do percurso numa fração (0–1) da volta
	at: (fraction: number) => readonly [number, number];
}

const LATS = ROUTE.map((p) => p[0]);
const LNGS = ROUTE.map((p) => p[1]);
const MIN_LAT = Math.min(...LATS);
const MAX_LAT = Math.max(...LATS);
const MIN_LNG = Math.min(...LNGS);
const MAX_LNG = Math.max(...LNGS);
const LAT_STRETCH = 1.1;

// Encaixa a volta de exemplo no retângulo, centralizada e sem distorcer.
export const projectRoute = (box: IStoryBox): IStoryRoute => {
	const scale = Math.min(box.w / (MAX_LNG - MIN_LNG), box.h / ((MAX_LAT - MIN_LAT) * LAT_STRETCH));
	const ox = box.x + (box.w - (MAX_LNG - MIN_LNG) * scale) / 2;
	const oy = box.y + (box.h - (MAX_LAT - MIN_LAT) * scale) / 2;
	const toXY = ([lat, lng]: readonly [number, number]): readonly [number, number] => [
		ox + (lng - MIN_LNG) * scale,
		oy + (MAX_LAT - lat) * scale,
	];
	const points = ROUTE.map(toXY);
	const d = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
	const first = points[0] ?? [0, 0];

	return {
		d,
		start: first,
		at: (fraction) => {
			const n = points.length - 1;
			const index = Math.round(n * (((fraction % 1) + 1) % 1));
			return points[index] ?? first;
		},
	};
};

// 1610 s → "26:50" · 5070 s → "1:24:30" (minutos sem zero à esquerda)
export const storyDuration = (totalSeconds: number): string => {
	const s = Math.max(0, Math.floor(totalSeconds));
	const h = Math.floor(s / 3600);
	const m = Math.floor((s % 3600) / 60);
	const sec = String(s % 60).padStart(2, "0");
	return h ? `${String(h)}:${String(m).padStart(2, "0")}:${sec}` : `${String(m)}:${sec}`;
};
