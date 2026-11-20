import { LENS } from "./constants";

export interface ILensSpot {
	size: number;
	x: number;
	opacity: number;
}

const lerpTable = (table: readonly number[], a: number): number => {
	"worklet";
	const last = table.length - 1;
	const i = Math.min(Math.floor(a), last);
	const j = Math.min(i + 1, last);
	const t = Math.min(1, a - i);
	return table[i] + (table[j] - table[i]) * t;
};

// Lente olho-de-peixe: d = índice da bolinha − posição atual (contínua)
export const lensAt = (d: number): ILensSpot => {
	"worklet";
	const a = Math.abs(d);
	const fade = (a - LENS.fadeFrom) / (LENS.fadeTo - LENS.fadeFrom);
	return {
		size: lerpTable(LENS.sizes, a),
		x: Math.sign(d) * lerpTable(LENS.offsets, a),
		opacity: Math.max(0, Math.min(1, 1 - fade)),
	};
};
