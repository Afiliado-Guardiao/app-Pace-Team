export const CHALLENGES_COPY = {
	title: "Desafios e conquistas",
	individual: "Individuais",
	team: "Equipe",
	unlocked: "Desbloqueadas",
	health:
		"Descanso também é treino. Sentiu dor ou cansaço fora do normal? Pause — nenhum desafio vale uma lesão.",
} as const;

export const CHALLENGE_TABS = [
	{ value: "ind", label: CHALLENGES_COPY.individual },
	{ value: "team", label: CHALLENGES_COPY.team },
] as const;

export interface IChallenge {
	icon: string;
	title: string;
	value: number;
	max: number;
	valueLabel: string;
	due: string;
	reward: string;
}

export const CHALLENGES_INDIVIDUAL: readonly IChallenge[] = [
	{
		icon: "route",
		title: "Correr 40 km na semana",
		value: 32.4,
		max: 40,
		valueLabel: "32,4 / 40 km",
		due: "Termina dom",
		reward: "Medalha Constância",
	},
	{
		icon: "calendar-check",
		title: "Completar 5 treinos",
		value: 4,
		max: 5,
		valueLabel: "4 / 5",
		due: "Termina dom",
		reward: "+40 pts bônus",
	},
	{
		icon: "zap",
		title: "Bater seu recorde de 5 km",
		value: 0,
		max: 1,
		valueLabel: "Atual 23'40\"",
		due: "Outubro",
		reward: "Medalha Explosão",
	},
];

export const CHALLENGES_TEAM: readonly IChallenge[] = [
	{
		icon: "users",
		title: "Time: 250 km coletivos",
		value: 182,
		max: 250,
		valueLabel: "182 / 250 km",
		due: "Termina dom",
		reward: "Escudo dourado",
	},
	{
		icon: "flag",
		title: "Temporada 3 — participar 8 semanas",
		value: 6,
		max: 8,
		valueLabel: "6 / 8 semanas",
		due: "30 nov",
		reward: "Selo Temporada 3",
	},
];

export const UNLOCKED = [
	{ icon: "sunrise", label: "Madrugador", color: "orange300" },
	{ icon: "mountain", label: "100 km", color: "orange400" },
	{ icon: "medal", label: "Top 5 cidade", color: "rankGold" },
] as const;
