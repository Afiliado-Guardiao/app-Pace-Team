// MODO VIRADA — disputa com o time rival. Números de exemplo do protótipo.

export type IViradaState = "equal" | "overtaking" | "done";
export type IViradaTone = "warning" | "accent" | "success";

export interface IViradaScenario {
	us: number;
	rival: number;
	pos: number;
	rivalPos: number;
	label: string;
	tone: IViradaTone;
	icon: string;
	msg: string;
	sub: string;
	// Progresso da barra de disputa (1 = virada)
	progress: number;
}

export const RIVAL = { name: "Trail Kings", city: "Valinhos" } as const;

export const VIRADA: Record<IViradaState, IViradaScenario> = {
	equal: {
		us: 2690,
		rival: 2755,
		pos: 4,
		rivalPos: 3,
		label: "Disputa equilibrada",
		tone: "warning",
		icon: "scale",
		msg: "Faltam 65 pts para ultrapassar",
		sub: "Uma corrida de 8 km resolve.",
		progress: 0.78,
	},
	overtaking: {
		us: 2748,
		rival: 2755,
		pos: 4,
		rivalPos: 3,
		label: "Estamos ultrapassando",
		tone: "accent",
		icon: "trending-up",
		msg: "Faltam só 7 pts!",
		sub: "Ritmo do time 3× maior na última hora.",
		progress: 0.97,
	},
	done: {
		us: 2812,
		rival: 2755,
		pos: 3,
		rivalPos: 4,
		label: "Virada concluída",
		tone: "success",
		icon: "trophy",
		msg: "Vocês passaram os Trail Kings!",
		sub: "+57 pts à frente · agora em 3º",
		progress: 1,
	},
};

export const VIRADA_OPTIONS = [
	{ value: "equal", label: "Equilibrada" },
	{ value: "overtaking", label: "Ultrapassando" },
	{ value: "done", label: "Virada" },
] as const;

// Pontos por dia da semana: nós × rival
export const WEEK = {
	days: ["S", "T", "Q", "Q", "S", "S", "D"],
	us: [310, 420, 260, 480, 390, 520, 310],
	them: [380, 350, 400, 420, 450, 410, 345],
} as const;

// Últimos confrontos semanais
export const HEAD_TO_HEAD = [
	{ week: "Semana 41", us: 1980, them: 2100 },
	{ week: "Semana 40", us: 1720, them: 1650 },
	{ week: "Semana 39", us: 1810, them: 1795 },
	{ week: "Semana 38", us: 1540, them: 1690 },
] as const;
