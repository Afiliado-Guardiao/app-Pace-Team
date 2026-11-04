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

interface IPoint {
	x: number;
	y: number;
}

interface IBuddyLiveState {
	// Último toque na tela (coordenadas da janela) e quando foi
	touch: { x: number; y: number; t: number } | null;
	// Gesto pendente: o Buddy faz na próxima parada (ou na hora, se parado)
	pendingAct: IBuddyAct | null;
	// Buddy vivo por cima da tela (Toque Traseiro com o app aberto)
	isPanelOpen: boolean;
	openPanel: () => void;
	closePanel: () => void;
	// Correr pelo Buddy vivo: ele sai do painel (from) e voa até o INICIAR
	flight: { from: IPoint } | null;
	// Centro do botão INICIAR na tela (a tela Correr avisa onde ele está)
	startTarget: IPoint | null;
	// Cada número novo = o Buddy "apertou" o INICIAR
	startSignal: number;
	launch: (from: IPoint) => void;
	setStartTarget: (target: IPoint) => void;
	pressStart: () => void;
	endFlight: () => void;
	setTouch: (x: number, y: number) => void;
	emit: (event: IBuddyEvent) => void;
	takePendingAct: () => IBuddyAct | null;
}

export const useBuddyLive = create<IBuddyLiveState>()((set, get) => ({
	touch: null,
	pendingAct: null,
	isPanelOpen: false,
	openPanel: () => {
		set({ isPanelOpen: true });
	},
	closePanel: () => {
		set({ isPanelOpen: false });
	},
	flight: null,
	startTarget: null,
	startSignal: 0,
	launch: (from) => {
		set({ isPanelOpen: false, flight: { from } });
	},
	setStartTarget: (target) => {
		set({ startTarget: target });
	},
	pressStart: () => {
		set({ startSignal: get().startSignal + 1 });
	},
	endFlight: () => {
		set({ flight: null });
	},
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
