// Geometria da cena do Início (Buddy de pelúcia sentado na pista de
// brinquedo), no espaço do protótipo: 625 × 438 "unidades de cena". A cena é
// desenhada com largura total do bloco e escala ks = largura / 625.
export const SCENE_W = 625;
export const SCENE_H = 438;

export interface IRect {
	x: number;
	y: number;
	w: number;
	h: number;
}

// Onde a pista (assets/hero/track.png, 1174 × 364) e o Buddy
// (assets/hero/buddy.png, 368 × 572) ficam na cena, medidos na referência
// do Claude Design (as duas imagens na mesma escala, 1,917 px por unidade)
const PX_PER_UNIT = 1.917;
export const TRACK_RECT: IRect = { x: 2.9, y: 219.1, w: 1174 / PX_PER_UNIT, h: 364 / PX_PER_UNIT };
export const BUDDY_RECT: IRect = { x: 222, y: -1, w: 368 / PX_PER_UNIT, h: 572 / PX_PER_UNIT };

// Corredor passando atrás do Buddy (some): reta do fundo, entre as pernas dele
export const BEHIND_BUDDY = { maxY: 252, minX: 222, maxX: 414, fade: 14 };

// Linha central da pista (fechada), do protótipo
const PATH: readonly (readonly [number, number])[] = [
	[56, 290],
	[72, 318],
	[105, 328],
	[150, 333],
	[200, 336],
	[250, 339],
	[294, 351],
	[325, 365],
	[362, 369],
	[400, 358],
	[437, 328],
	[475, 314],
	[519, 313],
	[552, 305],
	[572, 291],
	[566, 273],
	[544, 263],
	[510, 257],
	[481, 253],
	[437, 247],
	[406, 242],
	[300, 237],
	[225, 234],
	[169, 235],
	[125, 241],
	[87, 257],
	[62, 274],
];

const STEPS_PER_SEGMENT = 24;
export const PATH_SAMPLES = 360;

const catmull = (a: number, b: number, c: number, d: number, t: number): number => {
	const t2 = t * t;
	const t3 = t2 * t;
	return (
		0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
	);
};

const densePath = (): [number, number][] => {
	const n = PATH.length;
	const out: [number, number][] = [];
	for (let k = 0; k < n; k++) {
		const [p0, p1, p2, p3] = [PATH[(k - 1 + n) % n], PATH[k], PATH[(k + 1) % n], PATH[(k + 2) % n]];
		for (let s = 0; s < STEPS_PER_SEGMENT; s++) {
			const t = s / STEPS_PER_SEGMENT;
			out.push([catmull(p0[0], p1[0], p2[0], p3[0], t), catmull(p0[1], p1[1], p2[1], p3[1], t)]);
		}
	}
	return out;
};

// Pontos igualmente espaçados pelo comprimento: velocidade constante na volta
const resample = (dense: [number, number][]): { xs: number[]; ys: number[] } => {
	const lengths = [0];
	for (let i = 1; i <= dense.length; i++) {
		const [ax, ay] = dense[i - 1];
		const [bx, by] = dense[i % dense.length];
		lengths.push(lengths[i - 1] + Math.hypot(bx - ax, by - ay));
	}
	const total = lengths[lengths.length - 1];
	const xs: number[] = [];
	const ys: number[] = [];
	let j = 0;
	for (let s = 0; s < PATH_SAMPLES; s++) {
		const target = (s / PATH_SAMPLES) * total;
		while (lengths[j + 1] < target) j++;
		const f = (target - lengths[j]) / (lengths[j + 1] - lengths[j] || 1);
		const [ax, ay] = dense[j];
		const [bx, by] = dense[(j + 1) % dense.length];
		xs.push(ax + (bx - ax) * f);
		ys.push(ay + (by - ay) * f);
	}
	return { xs, ys };
};

export const TRACK_PATH = resample(densePath());

// Ponto da pista em u (0..1, voltas inteiras repetem) e para que lado anda
export const pointAt = (
	path: { xs: number[]; ys: number[] },
	u: number,
): { x: number; y: number; dx: number } => {
	"worklet";
	const n = path.xs.length;
	const f = (((u % 1) + 1) % 1) * n;
	const i = Math.floor(f) % n;
	const k = (i + 1) % n;
	const r = f - Math.floor(f);
	return {
		x: path.xs[i] + (path.xs[k] - path.xs[i]) * r,
		y: path.ys[i] + (path.ys[k] - path.ys[i]) * r,
		dx: path.xs[k] - path.xs[i],
	};
};

// Número "aleatório" fixo por semente (sem estado entre os quadros)
export const hash = (n: number): number => {
	"worklet";
	const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
	return s - Math.floor(s);
};
