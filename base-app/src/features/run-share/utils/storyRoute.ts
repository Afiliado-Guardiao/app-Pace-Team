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

const LAT_STRETCH = 1.1;
// Evita dividir por zero num percurso parado ou em linha reta
const MIN_SPAN = 1e-6;

// Encaixa o percurso da corrida no retângulo, centralizado e sem distorcer.
export const projectRoute = (
	box: IStoryBox,
	route: readonly (readonly [number, number])[],
): IStoryRoute => {
	const center = [box.x + box.w / 2, box.y + box.h / 2] as const;
	if (route.length < 2) return { d: "", start: center, at: () => center };
	const lats = route.map((p) => p[0]);
	const lngs = route.map((p) => p[1]);
	const minLat = Math.min(...lats);
	const maxLat = Math.max(...lats);
	const minLng = Math.min(...lngs);
	const maxLng = Math.max(...lngs);
	const spanLng = Math.max(maxLng - minLng, MIN_SPAN);
	const spanLat = Math.max(maxLat - minLat, MIN_SPAN);
	const scale = Math.min(box.w / spanLng, box.h / (spanLat * LAT_STRETCH));
	const ox = box.x + (box.w - spanLng * scale) / 2;
	const oy = box.y + (box.h - spanLat * scale) / 2;
	const toXY = ([lat, lng]: readonly [number, number]): readonly [number, number] => [
		ox + (lng - minLng) * scale,
		oy + (maxLat - lat) * scale,
	];
	const points = route.map(toXY);
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
