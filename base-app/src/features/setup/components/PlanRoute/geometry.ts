import { IPoint, lengthsAt, smoothPath } from "../../utils/curve";

// Medidas do rascunho do dono do app (print de 591 de largura), a partir do
// topo de "Montamos cada passo.". A tela encolhe tudo por s = largura / 591
export const ROUTE_BOX = { w: 591, h: 650 } as const;

// O caminho: equipe → Buddy → evolução → troféu
const ROUTE: readonly IPoint[] = [
	[97, 114],
	[134, 175],
	[190, 210],
	[236, 250],
	[247, 292],
	[262, 345],
	[300, 392],
	[319, 454],
	[350, 500],
	[400, 530],
	[445, 588],
];
export const ROUTE_PATH = smoothPath(ROUTE);
const LENGTHS = lengthsAt(ROUTE);
export const ROUTE_LENGTH = LENGTHS.at(-1) ?? 1;

// Cada parada (e em que fração do caminho a linha chega nela)
export const STOPS = {
	team: { x: 97, y: 114, r: 33, at: LENGTHS[0] / ROUTE_LENGTH },
	bud: { x: 247, y: 292, w: 85, at: LENGTHS[4] / ROUTE_LENGTH },
	trend: { x: 319, y: 454, r: 25, at: LENGTHS[7] / ROUTE_LENGTH },
	prize: { x: 445, y: 588, r: 28 },
} as const;

// Textos: posição (x à esquerda, ou right = borda direita), topo e tamanho
export const ROUTE_TEXT = {
	title: { x: 40, y: 18, size: 26 },
	team: { x: 147, y: 95, size: 20, subY: 118, subSize: 18 },
	bud: { x: 291, y: 256, size: 21, subY: 281, subSize: 18, line: 25 },
	trend: { right: 271, y: 430, size: 20, subY: 457, subSize: 18 },
} as const;
