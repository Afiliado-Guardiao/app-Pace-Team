import { IWeatherPreset } from "@/lib/weather";

// Tom da pista e dos corredores por clima (o Buddy nunca recebe filtro).
// Matrizes 4×5 de cor (formato do Skia ColorFilter.MakeMatrix).
type IMatrix = number[];

interface ITone {
	brightness: number;
	saturate: number;
	hue: number;
	sepia: number;
}

const TONES: Record<IWeatherPreset, ITone> = {
	day: { brightness: 1.03, saturate: 1.05, hue: 0, sepia: 0 },
	hot: { brightness: 1.1, saturate: 1.2, hue: 0, sepia: 0.14 },
	cold: { brightness: 0.94, saturate: 0.5, hue: -12, sepia: 0 },
	night: { brightness: 0.74, saturate: 0.82, hue: -6, sepia: 0 },
	rain: { brightness: 0.78, saturate: 0.72, hue: 0, sepia: 0 },
	storm: { brightness: 0.6, saturate: 0.62, hue: 0, sepia: 0 },
};

const LUMA = [0.2126, 0.7152, 0.0722];

const fromRgb = (m: number[][]): IMatrix => [
	...m[0],
	0,
	0,
	...m[1],
	0,
	0,
	...m[2],
	0,
	0,
	0,
	0,
	0,
	1,
	0,
];

const saturation = (s: number): number[][] =>
	[0, 1, 2].map((row) => LUMA.map((l, col) => l * (1 - s) + (row === col ? s : 0)));

const hueRotation = (deg: number): number[][] => {
	const a = (deg * Math.PI) / 180;
	const c = Math.cos(a);
	const s = Math.sin(a);
	return [
		[0.213 + c * 0.787 - s * 0.213, 0.715 - c * 0.715 - s * 0.715, 0.072 - c * 0.072 + s * 0.928],
		[0.213 - c * 0.213 + s * 0.143, 0.715 + c * 0.285 + s * 0.14, 0.072 - c * 0.072 - s * 0.283],
		[0.213 - c * 0.213 - s * 0.787, 0.715 - c * 0.715 + s * 0.715, 0.072 + c * 0.928 + s * 0.072],
	];
};

const sepiaMix = (p: number): number[][] => {
	const full = [
		[0.393, 0.769, 0.189],
		[0.349, 0.686, 0.168],
		[0.272, 0.534, 0.131],
	];
	return full.map((row, r) => row.map((v, c) => v * p + (r === c ? 1 - p : 0)));
};

const multiply = (a: number[][], b: number[][]): number[][] =>
	a.map((row) => [0, 1, 2].map((c) => row[0] * b[0][c] + row[1] * b[1][c] + row[2] * b[2][c]));

// Mesma ordem do CSS (brightness → saturate → hue-rotate → sepia)
export const toneMatrix = (preset: IWeatherPreset): IMatrix => {
	const t = TONES[preset];
	const bright = [0, 1, 2].map((r) => [0, 1, 2].map((c) => (r === c ? t.brightness : 0)));
	const m = multiply(
		sepiaMix(t.sepia),
		multiply(hueRotation(t.hue), multiply(saturation(t.saturate), bright)),
	);
	return fromRgb(m);
};
