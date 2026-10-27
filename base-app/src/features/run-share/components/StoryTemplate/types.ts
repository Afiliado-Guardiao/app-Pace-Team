import { ImageSourcePropType } from "react-native";

export type IStoryPoint = readonly [number, number];

export interface IStoryTeam {
	name: string;
	// Sigla na pílula ("PS")
	initials: string;
	rank: number;
	isUp: boolean;
	// Escudo que o capitão colocou (null = sigla)
	logoUrl?: string | null;
}

export interface IStoryMember {
	name: string;
	km: number;
	isYou: boolean;
}

// Tudo o que o story mostra da corrida e da equipe.
export interface IStoryRun {
	seconds: number;
	km: number;
	points: number;
	// Percurso (lat, lng); com menos de 2 pontos o traçado não aparece
	route: readonly IStoryPoint[];
	// null = atleta sem equipe (a pílula da equipe não aparece)
	team: IStoryTeam | null;
	// Fotos de quem correu junto (você e os colegas), em cima do traçado
	crew: ImageSourcePropType[];
	// Integrantes por km na semana (modelo "Integrantes")
	members: IStoryMember[];
}
