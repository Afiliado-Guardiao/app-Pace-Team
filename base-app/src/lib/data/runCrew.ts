import { ImageSourcePropType } from "react-native";

import { formatDistance } from "@/lib/pace";

import { ITeamRunView } from "./useTeamRun";

type IPoint = readonly [number, number];

// Foto de quem correu junto no desenho da corrida (compartilhar e postar)
export interface IRunCrewPin {
	image?: ImageSourcePropType;
	name: string;
	// "Wesley · 0 m" (correndo sozinho não tem: os números já estão na arte)
	label?: string;
	// Onde fica no percurso desenhado (0 = largada, 1 = chegada)
	at: number;
}

export interface IRunCrew {
	// Percurso desenhado: o mais longo de quem correu junto
	route: readonly IPoint[];
	crew: IRunCrewPin[];
}

interface IRunner {
	name: string;
	photo: string | null;
	km: number;
	route: readonly IPoint[];
}

// Quem não andou fica parado na largada; quem andou menos que o percurso
// desenhado fica no ponto proporcional ao que correu
const MAX_PARTIAL = 0.95;

const firstName = (name: string): string => name.trim().split(" ")[0] ?? name;

const pinOf = (runner: IRunner, at: number): IRunCrewPin => ({
	image: runner.photo ? { uri: runner.photo } : undefined,
	name: runner.name,
	label: `${firstName(runner.name)} · ${formatDistance(runner.km)}`,
	at,
});

// Sozinho: a sua foto redonda no fim do percurso. Com a equipe: o percurso
// de quem foi mais longe e a foto de cada um no lugar dele, com o nome e
// quanto correu (inclusive quem ficou parado).
export const buildRunCrew = (me: IRunner, teamRun: ITeamRunView | null): IRunCrew => {
	const mates = (teamRun?.mates ?? []).filter((m) => !m.isYou);
	if (mates.length === 0) {
		const solo: IRunCrewPin = {
			image: me.photo ? { uri: me.photo } : undefined,
			name: me.name,
			at: 1,
		};
		return { route: me.route, crew: me.photo ? [solo] : [] };
	}
	const runners: IRunner[] = [
		me,
		...mates.map((m) => ({ name: m.name, photo: m.avatarUrl, km: m.km, route: m.route })),
	];
	const drawn = runners.filter((r) => r.route.length > 1);
	const main = drawn.reduce<IRunner | null>(
		(best, r) => (best === null || r.km > best.km ? r : best),
		null,
	);
	const crew = runners.map((r) => {
		if (r === main) return pinOf(r, 1);
		if (!main || r.km <= 0 || r.route.length < 2) return pinOf(r, 0);
		return pinOf(r, Math.min(MAX_PARTIAL, r.km / Math.max(main.km, r.km)));
	});
	return { route: main?.route ?? me.route, crew };
};
