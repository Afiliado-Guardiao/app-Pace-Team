// Medalhas individuais (ids iguais aos de athlete_medals no banco) e o que
// libera cada uma. Cores: tokens usados nas telas de Desafios e Perfil.
export type IMedalColor = "rankGold" | "orange400" | "orange300";

export interface IMedal {
	id: "constancia" | "ritmo" | "explosao" | "madrugador" | "cem_km" | "top5";
	icon: string;
	label: string;
	color: IMedalColor;
	// Como conquistar
	rule: string;
}

export const MEDALS: readonly IMedal[] = [
	{
		id: "top5",
		icon: "medal",
		label: "Top 5 cidade",
		color: "rankGold",
		rule: "Fechar uma semana no Top 5",
	},
	{ id: "cem_km", icon: "mountain", label: "100 km", color: "orange400", rule: "Somar 100 km" },
	{
		id: "madrugador",
		icon: "sunrise",
		label: "Madrugador",
		color: "orange300",
		rule: "Correr antes das 6h",
	},
	{
		id: "constancia",
		icon: "flame",
		label: "Constância",
		color: "orange400",
		rule: "40 km numa semana",
	},
	{
		id: "ritmo",
		icon: "calendar-check",
		label: "Ritmo",
		color: "orange300",
		rule: "5 treinos numa semana",
	},
	{
		id: "explosao",
		icon: "zap",
		label: "Explosão",
		color: "rankGold",
		rule: "Bater o recorde de 5 km",
	},
];

// Prévia por link: as medalhas acesas do design (Perfil e "Desbloqueadas")
export const DEMO_MEDAL_IDS: readonly IMedal["id"][] = [
	"madrugador",
	"cem_km",
	"top5",
	"constancia",
];
