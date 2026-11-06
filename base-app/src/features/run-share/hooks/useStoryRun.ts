import { useMemo } from "react";

import { IRunCrewPin, ITeamView, useLastRunCrew, useMyTeam, useTeamOnline } from "@/lib/data";
import { MEMBERS, MY_TEAM } from "@/lib/pace";
import { ROUTE, useRunStore } from "@/lib/run";
import { IS_PREVIEW } from "@/constants/preview";

import { IStoryRun, IStoryTeam } from "../components/StoryTemplate";
import { SHARE_FALLBACK } from "../constants";

interface IUseStoryRunReturn {
	run: IStoryRun;
	// Dados de exemplo (prévia por link): a nota do rodapé avisa
	isDemo: boolean;
}

// Sigla da equipe na pílula do story: "Pace Sharks" → "PS"
const initialsOf = (name: string): string =>
	name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((word) => word.charAt(0))
		.join("")
		.toUpperCase();

// Pontos provisórios até o servidor confirmar: 8 por km, até 20 km
const provisionalPoints = (km: number): number => Math.floor(Math.min(km, 20) * 8);

const DEMO_RUN: IStoryRun = {
	...SHARE_FALLBACK,
	points: provisionalPoints(SHARE_FALLBACK.km),
	route: ROUTE,
	team: { name: MY_TEAM.name, initials: initialsOf(MY_TEAM.name), rank: MY_TEAM.rank, isUp: true },
	lines: [{ points: ROUTE, isOwner: true }],
	crew: [],
	members: MEMBERS.map((m) => ({ name: m.name, km: m.km, isYou: Boolean(m.you) })),
};

const storyTeam = (team: ITeamView | null): IStoryTeam | null =>
	team
		? {
				name: team.name,
				initials: initialsOf(team.name),
				rank: team.position,
				isUp: true,
				logoUrl: team.logoUrl,
			}
		: null;

// Prévia por link: fotos de exemplo espalhadas pelo traçado
const DEMO_AT = [0.92, 0.66, 0.4, 0.16] as const;

// Story da última corrida: métricas, o percurso de cada um que correu (a
// mesma turma em todo celular, vinda do servidor) e a equipe atual.
export const useStoryRun = (): IUseStoryRunReturn => {
	const lastResult = useRunStore((s) => s.lastResult);
	const { team } = useMyTeam();
	const { mates } = useTeamOnline();
	const together = useLastRunCrew();

	return useMemo(() => {
		if (IS_PREVIEW) {
			const crew = mates.slice(0, DEMO_AT.length).map(
				(m, i): IRunCrewPin => ({
					image: m.image,
					name: m.name,
					label: m.name,
					at: DEMO_AT[i] ?? 0,
				}),
			);
			return { run: { ...DEMO_RUN, crew }, isDemo: true };
		}
		const km = lastResult?.km ?? 0;
		return {
			isDemo: false,
			run: {
				seconds: lastResult?.seconds ?? 0,
				km,
				points: lastResult?.saved?.points ?? provisionalPoints(km),
				route: together.route,
				lines: together.lines,
				team: storyTeam(team),
				crew: together.crew,
				members: (team?.members ?? []).map((m) => ({
					name: m.name,
					km: m.km,
					isYou: Boolean(m.you),
				})),
			},
		};
	}, [lastResult, team, mates, together]);
};
