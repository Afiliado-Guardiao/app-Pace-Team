// Percurso real (lat, lng) → traçado no viewBox 100 × 140 da arte, dentro da
// área do meio (entre as métricas e o selo da equipe), mantendo a proporção.
const BOX = { x: 18, y: 36, w: 64, h: 54 } as const;
// A arte é 100 × 140 mas é esticada até a largura: 1 unidade em x vale 1,4 em y
const ASPECT = 1.4;

export interface IPostTrack {
	d: string;
	// Ponto do traçado numa fração (0–1), em % da arte (x de 0–100, y de 0–100)
	at: (fraction: number) => readonly [number, number];
}

export const postTrack = (route: readonly (readonly [number, number])[]): IPostTrack | null => {
	if (route.length < 2) return null;
	const lats = route.map((p) => p[0]);
	const lngs = route.map((p) => p[1]);
	const minLat = Math.min(...lats);
	const maxLat = Math.max(...lats);
	const minLng = Math.min(...lngs);
	const kx = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
	const w = (Math.max(...lngs) - minLng) * kx;
	const h = maxLat - minLat;
	// Em unidades reais da tela (y vale ASPECT vezes x)
	const scale = Math.min(BOX.w / Math.max(w, 1e-9), (BOX.h * ASPECT) / Math.max(h, 1e-9));
	const offX = BOX.x + (BOX.w - w * scale) / 2;
	const offY = BOX.y + (BOX.h - (h * scale) / ASPECT) / 2;
	const points = route.map(
		(p) =>
			[offX + (p[1] - minLng) * kx * scale, offY + ((maxLat - p[0]) * scale) / ASPECT] as const,
	);
	const d = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
	return {
		d,
		at: (fraction) => {
			const point = points.at(Math.round(fraction * (points.length - 1))) ?? [50, 70];
			return [point[0], (point[1] / 140) * 100];
		},
	};
};
