// Arte 3D do novo Bud (algodão), recortada do fundo preto em camadas:
// corpo inteiro (domo) e as mãos. "handL"/"handR" são a mão como na arte
// (encaixada no corpo); "Full" é a esfera completa, para quando a mão se mexe.
import body from "../../../../assets/bud/body.png";
import handL from "../../../../assets/bud/handL.png";
import handLFull from "../../../../assets/bud/handLFull.png";
import handR from "../../../../assets/bud/handR.png";
import handRFull from "../../../../assets/bud/handRFull.png";

export const BUD_ART = { body, handL, handR, handLFull, handRFull } as const;

// Medidas na arte original (px): caixa do corpo e das mãos
const SRC = { x: 125, y: 535, w: 455, h: 444 } as const;

// Corpo no quadro do Buddy (140 × 135): base no mesmo lugar do corpo antigo
export const BODY_W = 88;
export const BODY_H = Math.round((BODY_W * SRC.h) / SRC.w);
export const BODY_LEFT = 26;
export const BODY_TOP = 102 - BODY_H;
const K = BODY_W / SRC.w;

interface IArtBox {
	left: number;
	top: number;
	width: number;
	height: number;
}

// Caixa de uma camada da arte, no quadro do Buddy
const box = (x: number, y: number, w: number, h: number): IArtBox => ({
	left: BODY_LEFT + (x - SRC.x) * K,
	top: BODY_TOP + (y - SRC.y) * K,
	width: w * K,
	height: h * K,
});

export const HAND_BOX = {
	handL: box(48, 737, 126, 159),
	handR: box(526, 737, 130, 159),
	handLFull: box(47, 738, 159, 159),
	handRFull: box(499, 738, 159, 159),
} as const;

// Rosto (olhos, boca e acessórios) usa o quadro antigo de 88 × 70 do corpo,
// descido até a altura dos olhos da arte nova (45% do corpo)
export const FACE_TOP = Math.round(BODY_H * 0.456 - 30);
