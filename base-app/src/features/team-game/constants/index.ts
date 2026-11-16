import { ITeamGameLevel } from "@/lib/supabase";

export const GAME_COPY = {
	title: "Roleta da equipe",
	sub: "Gira por todos que estão online agora",
	onlineTitle: "Quem entra na roleta",
	onlineNone: "Ninguém da equipe está online agora. A roleta precisa de pelo menos 2 pessoas.",
	levelTitle: "Escolha o nível",
	call: "Chamar a roleta",
	spin: "Girar a roleta",
	spinning: "Girando…",
	waitStarter: (name: string) => `${name} está girando a roleta`,
	cancel: "Desistir da roleta",
	fell: "Caiu:",
	runs: "corre",
	at: "a",
	mineTitle: "Seu desafio",
	mineHint: "Corra agora e bata a distância e o pace. A corrida confere sozinha.",
	runMine: "Correr meu desafio",
	until: (time: string) => `Vale até ${time}`,
	again: "Nova roleta",
	win: (pts: number) => `Todos cumpriram! +${String(pts)} pontos para cada um no ranking`,
	lose: "Nem todos cumpriram. Quem falhou perdeu pontos no ranking",
	rules: (win: number, lose: number) =>
		`Todos cumprem: +${String(win)} pts cada · Quem falhar: −${String(lose)} pts`,
	statusPending: "correndo",
	statusWaiting: "aguardando",
	statusDone: "cumpriu",
	statusFailed: "falhou",
	errNeedTwo: "A roleta precisa de pelo menos 2 pessoas da equipe online.",
	errActive: "Já tem uma roleta rolando na sua equipe.",
	errGeneric: "Não deu para girar agora. Tente de novo.",
} as const;

export interface IGameLevelInfo {
	level: ITeamGameLevel;
	label: string;
	desc: string;
	win: number;
	lose: number;
}

// Mesmos pontos de public.team_game_stakes
export const GAME_LEVELS: readonly IGameLevelInfo[] = [
	{ level: "facil", label: "Fácil", desc: "2 a 4 km, pace leve", win: 25, lose: 10 },
	{ level: "medio", label: "Intermediário", desc: "4 a 7 km, pace firme", win: 35, lose: 15 },
	{ level: "dificil", label: "Difícil", desc: "6 a 12 km, pace forte", win: 50, lose: 20 },
];

// "5:30"
export const formatPace = (sec: number): string =>
	`${String(Math.floor(sec / 60))}:${String(Math.round(sec % 60)).padStart(2, "0")}`;

// "18:40"
export const formatClock = (iso: string): string => {
	const d = new Date(iso);
	return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};
