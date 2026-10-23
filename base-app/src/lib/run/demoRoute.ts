// Rota de exemplo do protótipo (volta no Ibirapuera), densificada para um
// traçado suave. Usada na prévia web e nas corridas de exemplo.
const KEY_POINTS: readonly [number, number][] = [
	[-23.5815, -46.6608],
	[-23.583, -46.662],
	[-23.5848, -46.6627],
	[-23.5866, -46.6619],
	[-23.588, -46.66],
	[-23.5893, -46.6578],
	[-23.5899, -46.6553],
	[-23.5893, -46.6528],
	[-23.5878, -46.651],
	[-23.586, -46.6503],
	[-23.5842, -46.651],
	[-23.5829, -46.6527],
	[-23.582, -46.6548],
	[-23.5812, -46.657],
	[-23.581, -46.659],
	[-23.5813, -46.6604],
];

const STEPS = 8;

export const ROUTE: readonly [number, number][] = (() => {
	const out: [number, number][] = [];
	for (let i = 0; i < KEY_POINTS.length - 1; i++) {
		const a = KEY_POINTS.at(i);
		const b = KEY_POINTS.at(i + 1);
		if (!a || !b) continue;
		for (let s = 0; s < STEPS; s++) {
			const t = s / STEPS;
			out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
		}
	}
	const last = KEY_POINTS.at(-1);
	if (last) out.push(last);
	return out;
})();

// Centro da rota de exemplo
export const ROUTE_CENTER: [number, number] = (() => {
	const lats = ROUTE.map((p) => p[0]);
	const lngs = ROUTE.map((p) => p[1]);
	return [(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lngs) + Math.max(...lngs)) / 2];
})();
