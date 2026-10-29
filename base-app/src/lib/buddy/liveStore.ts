import { create } from "zustand";

import { IBuddyAct } from "./constants";

// O que acontece no app e o Buddy que corre pelas telas percebe: onde o dedo
// está (ele olha para lá) e o que o atleta acabou de fazer (ele reage).
export type IBuddyEvent = "like" | "post" | "rankUp" | "rankDown";

const EVENT_ACT: Record<IBuddyEvent, IBuddyAct> = {
	like: "celebrate",
	post: "excited",
	rankUp: "impressed",
	rankDown: "tilt",
};

const TOUCH_EVERY_MS = 80;

interface IBuddyLiveState {
	// Último toque na tela (coordenadas da janela) e quando foi
	touch: { x: number; y: number; t: number } | null;
	// Gesto pendente: o Buddy faz na próxima parada (ou na hora, se parado)
	pendingAct: IBuddyAct | null;
	setTouch: (x: number, y: number) => void;
	emit: (event: IBuddyEvent) => void;
	takePendingAct: () => IBuddyAct | null;
}

export const useBuddyLive = create<IBuddyLiveState>()((set, get) => ({
	touch: null,
	pendingAct: null,
	setTouch: (x, y) => {
		// No máximo ~12 vezes por segundo (o olhar não precisa de mais)
		const now = Date.now();
		const last = get().touch;
		if (last && now - last.t < TOUCH_EVERY_MS) return;
		set({ touch: { x, y, t: now } });
	},
	emit: (event) => {
		set({ pendingAct: EVENT_ACT[event] });
	},
	takePendingAct: () => {
		const act = get().pendingAct;
		if (act) set({ pendingAct: null });
		return act;
	},
}));
