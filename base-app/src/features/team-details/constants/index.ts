export const TEAM_DETAILS_COPY = {
	title: "Detalhes da equipe",
	share: "Compartilhar",
	name: "Pace Sharks",
	category: "5 x 5",
	since: "Desde mar 2026",
	about: "Corredores de Campinas que treinam juntos no Taquaral às terças e no Barão aos domingos.",
	rank: "Ranking atual",
	rankValue: "4º",
	rankSub: "Anterior: 6º",
	totalKm: "Km totais",
	totalKmValue: "2.418",
	season: "Temporada 3",
	weekly: "Desempenho semanal",
	weeklyUnit: "km por dia",
	achievements: "Conquistas",
	members: "Integrantes e funções",
	manage: "Gerenciar",
	bestFive: " · melhor 5K ",
	captain: "Capitão",
	challenges: "Próximos desafios",
	challengeLabel: " km coletivos nesta semana",
	weekKm: " km na semana",
	challengeValue: "182 / 250",
} as const;

// Altura de cada barra (px numa área de 110) de segunda a domingo
export const WEEK_BARS = [62, 78, 54, 90, 70, 96, 40] as const;
export const WEEK_DAYS = "STQQSSD";
export const WEEK_AREA = 110;
export const WEEK_HIGHLIGHT = 5;

export const ACHIEVEMENTS = [
	{ icon: "medal", label: "Top 5" },
	{ icon: "flame", label: "8 sem." },
	{ icon: "mountain", label: "1.000 km" },
	{ icon: "zap", label: "Recorde" },
] as const;

// Meta coletiva da semana: 50 km por vaga (5 x 5 = 250 km)
export const WEEKLY_KM_PER_MEMBER = 50;
