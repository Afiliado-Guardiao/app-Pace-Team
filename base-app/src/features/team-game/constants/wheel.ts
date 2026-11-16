// Geometria da roleta dupla: anel de fora (desafios) e de dentro (nomes)
export const WHEEL_MAX = 320;
export const SPIN_MS = 3600;
// Raios em fração do raio total
export const OUTER_IN = 0.67;
export const NAME_OUT = 0.65;
export const NAME_IN = 0.33;
export const HUB = 0.31;

const point = (c: number, r: number, a: number): [number, number] => [
	c + r * Math.sin(a),
	c - r * Math.cos(a),
];

// Fatia de anel centrada no ângulo do índice i (0 = em cima)
export const ringSlice = (o: {
	c: number;
	r0: number;
	r1: number;
	i: number;
	n: number;
}): string => {
	const step = (2 * Math.PI) / o.n;
	const a0 = (o.i - 0.5) * step;
	const a1 = (o.i + 0.5) * step;
	const large = a1 - a0 > Math.PI ? 1 : 0;
	const [x0, y0] = point(o.c, o.r1, a0);
	const [x1, y1] = point(o.c, o.r1, a1);
	const [x2, y2] = point(o.c, o.r0, a1);
	const [x3, y3] = point(o.c, o.r0, a0);
	return [
		`M${x0.toFixed(2)},${y0.toFixed(2)}`,
		`A${String(o.r1)},${String(o.r1)} 0 ${String(large)} 1 ${x1.toFixed(2)},${y1.toFixed(2)}`,
		`L${x2.toFixed(2)},${y2.toFixed(2)}`,
		`A${String(o.r0)},${String(o.r0)} 0 ${String(large)} 0 ${x3.toFixed(2)},${y3.toFixed(2)}`,
		"Z",
	].join(" ");
};

// Giro que termina com a casa "index" embaixo da seta (em cima), depois de
// "turns" voltas inteiras na direção "dir" (1 horário, -1 anti-horário)
export const landAngle = (o: {
	from: number;
	index: number;
	n: number;
	turns: number;
	dir: 1 | -1;
}): number => {
	const target = -(o.index * 360) / o.n;
	const mod = (((target - o.from) % 360) + 360) % 360;
	const delta = o.dir === 1 ? mod : mod - 360;
	return o.from + delta + o.dir * o.turns * 360;
};
