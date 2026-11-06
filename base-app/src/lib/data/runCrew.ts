import { ImageSourcePropType } from "react-native";

import { formatDistance, formatPace } from "@/lib/pace";

import { ICrewLine } from "./crewArt";
import { ICrewRunner } from "./useRunCrew";

type IPoint = readonly [number, number];

// Foto de quem correu no desenho da corrida (compartilhar e postar)
export interface IRunCrewPin {
	image?: ImageSourcePropType;
	name: string;
	// "Wesley · 1,20 km · 5'07\"" (correndo sozinho não tem: os números já
	// estão na arte)
	label?: string;
	// Percurso dele em `lines` (a foto fica no fim dele); -1 = sem percurso
	// (fica na largada). Posts antigos não têm: usam `at` no percurso único.
	line?: number;
	// Posts antigos: lugar no percurso único (0 = largada, 1 = chegada)
	at: number;
}

export interface IRunCrew {
	// Percurso do dono da corrida (posts e modelos antigos)
	route: readonly IPoint[];
	// Todos os percursos (sozinho: só o seu), cada um no lugar de verdade
	lines: ICrewLine[];
	crew: IRunCrewPin[];
}

// Quem fez a corrida, com o percurso de GPS (para correr sozinho)
export interface IRunOwner {
	name: string;
	photo: string | null;
	route: readonly IPoint[];
}

const firstName = (name: string): string => name.trim().split(" ")[0] ?? name;

// Nome, distância e o ritmo (ou "correndo", se ainda não terminou)
const labelOf = (runner: ICrewRunner): string => {
	const base = `${firstName(runner.name)} · ${formatDistance(runner.km)}`;
	if (runner.isLive) return `${base} · correndo`;
	return runner.km > 0 && runner.seconds > 0
		? `${base} · ${formatPace(runner.seconds / runner.km)}`
		: base;
};

const soloCrew = (me: IRunOwner): IRunCrew => ({
	route: me.route,
	lines: me.route.length > 0 ? [{ points: me.route, isOwner: true }] : [],
	crew: me.photo ? [{ image: { uri: me.photo }, name: me.name, line: 0, at: 1 }] : [],
});

// Sozinho: o seu percurso e a sua foto no fim. Com a equipe (lista do
// servidor, a mesma em todo celular): o percurso de cada um, no lugar de
// verdade, e a foto de cada um no fim do dele, com nome e quanto correu.
// Quem andou pouco vira um tracinho; quem não tem GPS fica na largada.
export const buildRunCrew = (me: IRunOwner, runners: readonly ICrewRunner[]): IRunCrew => {
	if (runners.length < 2) return soloCrew(me);
	const lines = runners.map((r) => ({ points: r.shape, isOwner: r.isOwner }));
	const owner = runners.find((r) => r.isOwner) ?? runners.at(0);
	return {
		route: owner?.shape ?? [],
		lines,
		crew: runners.map((r, i) => ({
			image: r.photo ? { uri: r.photo } : undefined,
			name: r.name,
			label: labelOf(r),
			line: r.shape.length > 0 ? i : -1,
			at: 1,
		})),
	};
};
