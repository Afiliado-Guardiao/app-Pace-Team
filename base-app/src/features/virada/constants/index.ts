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
	emptyNoTeamTitle: "Entre numa equipe",
	emptyNoTeamBody:
		"O Modo Virada mostra a disputa da sua equipe com a que está logo à frente no ranking da cidade.",
	emptyNoTeamAction: "Ir para Equipe",
	emptyNoRivalTitle: "Ainda sem rival",
	emptyNoRivalBody:
		"Assim que outra equipe da sua categoria correr na sua cidade, a disputa aparece aqui.",
	emptyNoRivalAction: "Ver ranking",
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

// Dias do gráfico "pts / dia" (segunda a domingo)
export const WEEK_DAYS = ["S", "T", "Q", "Q", "S", "S", "D"] as const;
