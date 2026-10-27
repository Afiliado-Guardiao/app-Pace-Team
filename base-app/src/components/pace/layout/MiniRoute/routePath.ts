// Percurso real (lat, lng) → traçado SVG numa caixa 64 × 64, mantendo a
// proporção do caminho (o norte fica para cima).
const BOX = 64;
const PAD = 9;

interface IRoutePath {
	d: string;
	start: readonly [number, number];
	end: readonly [number, number];
}

export const routePath = (route: readonly (readonly [number, number])[]): IRoutePath | null => {
	if (route.length < 2) return null;
	const lats = route.map((p) => p[0]);
	const lngs = route.map((p) => p[1]);
	const minLat = Math.min(...lats);
	const maxLat = Math.max(...lats);
	const minLng = Math.min(...lngs);
	const maxLng = Math.max(...lngs);
	// 1° de longitude encolhe com a latitude
	const kx = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
	const w = (maxLng - minLng) * kx;
	const h = maxLat - minLat;
	const scale = (BOX - PAD * 2) / Math.max(w, h, 1e-9);
	const offX = (BOX - w * scale) / 2;
	const offY = (BOX - h * scale) / 2;
	const xy = (p: readonly [number, number]): readonly [number, number] => [
		Number((offX + (p[1] - minLng) * kx * scale).toFixed(1)),
		Number((offY + (maxLat - p[0]) * scale).toFixed(1)),
	];
	const points = route.map(xy);
	const d = points.map(([x, y], i) => `${i ? "L" : "M"}${String(x)} ${String(y)}`).join(" ");
	const start = points[0] ?? [0, 0];
	const end = points.at(-1) ?? start;
	return { d, start, end };
};
