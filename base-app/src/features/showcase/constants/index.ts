import { ImageSourcePropType } from "react-native";

import rankingShot from "../../../../assets/onboarding/ranking.png";
import storyShot from "../../../../assets/onboarding/story.png";

// Medidas na referência de 390 de largura (a tela encolhe/estica por k)

export interface IAppShot {
	source: ImageSourcePropType;
	x: number;
	y: number;
	w: number;
	h: number;
}

// Duas telas do app inclinadas (a arte de compartilhar e o ranking da montanha)
export const APP_SHOTS: readonly IAppShot[] = [
	{ source: storyShot, x: 205, y: 27, w: 130, h: 169 },
	{ source: rankingShot, x: 25, y: 202, w: 143, h: 168 },
];

export interface IHandNote {
	text: string;
	x: number;
	y: number;
	w: number;
	align: "left" | "center";
}

// Frases escritas à mão
export const HAND_NOTES: readonly IHandNote[] = [
	{ text: "corra com seus\namigos", x: 24, y: 64, w: 150, align: "center" },
	{ text: "não deixe o buddy\ndoente", x: 140, y: 180, w: 128, align: "center" },
	{ text: "faça uma equipe e\nsuba a montanha", x: 214, y: 258, w: 170, align: "left" },
];

// Setas à mão (caminho + ponta) e risquinhos de brilho, no mesmo espaço 390
export const HAND_ARROWS: readonly string[] = [
	"M150 118 C 162 134, 182 138, 203 131 M203 131 L 194 125 M203 131 L 195 139",
	"M184 176 C 178 160, 156 150, 132 154 M132 154 L 141 147 M132 154 L 141 161",
	"M168 320 C 184 324, 202 318, 216 306 M216 306 L 206 307 M216 306 L 212 315",
];
export const SPARKS: readonly string[] = [
	"M198 32 L 206 40 M194 44 L 204 46 M207 26 L 209 36",
	"M340 186 L 350 192 M342 198 L 354 200 M336 202 L 342 210",
	"M22 228 L 32 236 M16 242 L 28 244 M26 252 L 34 256",
	"M176 368 Q 192 362 208 368 M180 376 Q 194 371 206 376",
];

// Buddy doente pequenininho (para "não deixe o buddy doente")
export const SICK_BUD = { x: 54, y: 138, w: 74 } as const;

// Altura da área de cima na referência de 390 de largura
export const COLLAGE_H = 380;

export const SHOWCASE_COPY = {
	name: "buddy",
	lineA: "Cada corrida.",
	lineB: "Cada km.",
	lineC: "Juntos.",
	cta: "Começar",
	login: "Já tenho conta",
} as const;
