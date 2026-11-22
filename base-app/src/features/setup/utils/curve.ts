// Curvas suaves que passam pelos pontos (Catmull-Rom → Bézier) e o tamanho
// delas, para desenhar a linha aos poucos

export type IPoint = readonly [number, number];

const SAMPLES = 24;

interface ISegment {
	p0: IPoint;
	c1: IPoint;
	c2: IPoint;
	p1: IPoint;
}

const segments = (pts: readonly IPoint[]): ISegment[] =>
	pts.slice(0, -1).map((p1, i) => {
		const p0 = pts[i - 1] ?? p1;
		const p2 = pts[i + 1];
		const p3 = pts[i + 2] ?? p2;
		return {
			p0: p1,
			c1: [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6],
			c2: [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6],
			p1: p2,
		};
	});

const f = (n: number): string => n.toFixed(1);

export const smoothPath = (pts: readonly IPoint[]): string =>
	segments(pts).reduce(
		(d, s) =>
			`${d} C${f(s.c1[0])} ${f(s.c1[1])} ${f(s.c2[0])} ${f(s.c2[1])} ${f(s.p1[0])} ${f(s.p1[1])}`,
		`M${f(pts[0][0])} ${f(pts[0][1])}`,
	);

const bezierAt = (s: ISegment, t: number): IPoint => {
	const u = 1 - t;
	const a = u * u * u;
	const b = 3 * u * u * t;
	const c = 3 * u * t * t;
	const d = t * t * t;
	return [
		a * s.p0[0] + b * s.c1[0] + c * s.c2[0] + d * s.p1[0],
		a * s.p0[1] + b * s.c1[1] + c * s.c2[1] + d * s.p1[1],
	];
};

const segmentLength = (s: ISegment): number => {
	let total = 0;
	let prev = s.p0;
	for (let i = 1; i <= SAMPLES; i += 1) {
		const next = bezierAt(s, i / SAMPLES);
		total += Math.hypot(next[0] - prev[0], next[1] - prev[1]);
		prev = next;
	}
	return total;
};

// Comprimento acumulado até cada ponto (o último é o total)
export const lengthsAt = (pts: readonly IPoint[]): number[] =>
	segments(pts).reduce<number[]>((acc, s) => [...acc, (acc.at(-1) ?? 0) + segmentLength(s)], [0]);
