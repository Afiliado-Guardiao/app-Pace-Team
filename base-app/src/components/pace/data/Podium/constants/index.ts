import { IPodiumPlace } from "../types";

// Ordem visual: 2º · 1º · 3º
export const PODIUM_ORDER: readonly { index: number; place: IPodiumPlace; flex: number }[] = [
	{ index: 1, place: 2, flex: 1 },
	{ index: 0, place: 1, flex: 1.12 },
	{ index: 2, place: 3, flex: 1 },
];

// Atraso de entrada por posição (o 3º sobe primeiro)
export const PODIUM_DELAY: Record<IPodiumPlace, number> = { 1: 240, 2: 120, 3: 0 };
export const BLOCK_HEIGHT: Record<IPodiumPlace, number> = { 1: 120, 2: 92, 3: 72 };
export const AVATAR_SIZE: Record<IPodiumPlace, number> = { 1: 60, 2: 50, 3: 50 };

export const AVATAR_POP_OFFSET = 300;
export const POINTS_COUNT_OFFSET = 200;
