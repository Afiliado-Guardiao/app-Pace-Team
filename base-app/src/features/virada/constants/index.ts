import { IViradaState } from "@/lib/pace";

export const VIRADA_COPY = {
	title: "Modo virada",
	simulate: "Simular estado da disputa",
	helpTeam: "Vou ajudar meu time",
	keepLead: "Manter a liderança",
	cityRanking: "Ranking da cidade",
	seeAll: "Ver tudo",
	weekly: "Desempenho semanal",
	perDay: "pts / dia",
	headToHead: "Últimos confrontos",
	contribution: "Contribuição do time",
	you: "Você",
	difference: "Diferença",
	position: "Posição",
	closesIn: "Fecha em",
	closesValue: "2d 14h",
	win: "V",
	loss: "D",
	vs: "VS",
} as const;

// Título do placar: começo + palavra em destaque
export const HERO_TITLES: Record<IViradaState, { start: string; highlight: string }> = {
	equal: { start: "Placar", highlight: "apertado" },
	overtaking: { start: "Estamos", highlight: "chegando" },
	done: { start: "Virada", highlight: "concluída!" },
};

export const MY_TEAM_POINTS_BASE = 2140;
