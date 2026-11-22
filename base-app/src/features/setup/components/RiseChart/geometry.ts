import { IPoint, smoothPath } from "../../utils/curve";

// Medidas do rascunho do dono do app (print de 591 de largura), a partir do
// topo do título. A tela encolhe tudo por s = largura / 591
export const RISE = { w: 591, h: 613 } as const;

// Com o PACE TEAM: sobe do dia 1 até o troféu no mês 2
const WITH: readonly IPoint[] = [
	[65, 473],
	[90, 450],
	[120, 432],
	[150, 421],
	[180, 402],
	[210, 389],
	[270, 357],
	[330, 331],
	[390, 304],
	[450, 279],
	[525, 251],
];
// Sem apoio: sobe um pouco e vai caindo
const WITHOUT: readonly IPoint[] = [
	[65, 473],
	[105, 433],
	[145, 411],
	[200, 391],
	[240, 398],
	[295, 400],
	[340, 411],
	[395, 412],
	[470, 431],
	[527, 446],
];

export const BASE_Y = 523;
export const START = { x: 65, y: 473 } as const;
export const END_WITHOUT = { x: 527, y: 446 } as const;
export const TROPHY = { x: 525, y: 251, r: 19 } as const;
// Até onde a linha vai sendo revelada (passa um pouco do fim)
export const REVEAL = { from: 56, to: 545 } as const;

export const WITH_PATH = smoothPath(WITH);
export const WITH_AREA = `${WITH_PATH} L525 ${String(BASE_Y)} L65 ${String(BASE_Y)} Z`;
export const WITHOUT_PATH = smoothPath(WITHOUT);

// Textos (x, topo, tamanho da letra) no mesmo espaço
export const RISE_TEXT = {
	title: { x: 13, y: 6, size: 30, line: 37 },
	sub: { x: 30, y: 113, size: 22 },
	ends: { x: 22, right: 36, y: 171, size: 15 },
	axis: { x: 37, y: 363, size: 13 },
	legend: { x: 30, right: 16, y: 541, size: 16 },
	note: { y: 580, size: 14 },
} as const;
