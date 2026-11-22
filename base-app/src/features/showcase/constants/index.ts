import welcomeTop from "../../../../assets/onboarding/welcome-top.png";

// Tudo medido na referência do dono do app: o print do iPhone inteiro em
// 591 × 1280. A tela é montada nesse quadro e encolhe/estica por u
// (u = largura da tela / 591, limitado pela altura)
export const REF = { w: 591, h: 1280 } as const;

// Parte de cima: a arte do dono do app, recortada da referência (0 a 720).
// As frases foram tiradas da imagem e vão escritas por cima (letra de mão),
// com a ortografia certa, no mesmo lugar
export const TOP_ART = welcomeTop;
export const TOP_ART_H = 720;

export interface IHandNote {
	text: string;
	x: number;
	y: number;
	w: number;
}

// Frases à mão (centralizadas na largura w), no quadro da referência
export const HAND_NOTES: readonly IHandNote[] = [
	{ text: "conecte com o\nseu relógio", x: 166, y: 68, w: 160 },
	{ text: "para incentivar a\nequipe a ganhar\nmais pontos", x: 225, y: 264, w: 190 },
	{
		text: "fala quanto de água tem que beber depois da corrida e outras\nfunções",
		x: 6,
		y: 504,
		w: 580,
	},
	{ text: "mas cuidado para não deixar ele doente por falta de corrida", x: 6, y: 628, w: 580 },
];
export const NOTE_FONT = { size: 20, line: 30 } as const;

// O Bud grande, a frase, o Começar e o "Já tenho conta"
export const HERO = { x: 175, y: 722, w: 240 } as const;
export const WORDS = { y: 936, size: 46, line: 53 } as const;
export const CTA = { x: 28, y: 1100, w: 535, h: 90, font: 26 } as const;
export const LOGIN = { y: 1210, font: 23 } as const;

export const SHOWCASE_COPY = {
	name: "buddy",
	lineA: "Cada corrida.",
	lineB: "Cada km.",
	lineC: "Juntos.",
	cta: "Começar",
	login: "Já tenho conta",
} as const;
