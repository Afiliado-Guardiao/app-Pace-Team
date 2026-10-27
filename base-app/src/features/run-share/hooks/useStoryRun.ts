import { useMemo } from "react";
import { ImageSourcePropType } from "react-native";

import { ITeamRunView, ITeamView, useMyTeam, useTeamOnline, useTeamRun } from "@/lib/data";
import { MEMBERS, MY_TEAM } from "@/lib/pace";
import { ROUTE, useRunStore } from "@/lib/run";
import { useStore } from "@/store";
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

// Correu com a equipe: a sua foto e a de quem correu junto no mesmo horário
const crewOf = (myPhoto: string | null, teamRun: ITeamRunView | null): ImageSourcePropType[] => {
	if (!teamRun) return [];
	const photos = [myPhoto ?? teamRun.avatarUrl, ...teamRun.mates.map((m) => m.avatarUrl)];
	const crew = photos.filter((url): url is string => Boolean(url)).map((uri) => ({ uri }));
	return crew.length > 1 ? crew : [];
};

// Story da última corrida: métricas, percurso de verdade e a equipe atual.
export const useStoryRun = (): IUseStoryRunReturn => {
	const lastResult = useRunStore((s) => s.lastResult);
	const { team } = useMyTeam();
	const { mates } = useTeamOnline();
	const myPhoto = useStore((s) => s.user?.avatarUrl ?? null);
	const savedId = lastResult?.mode === "team" ? lastResult.saved?.id : undefined;
	const { run: teamRun } = useTeamRun(savedId);

	return useMemo(() => {
		if (IS_PREVIEW) {
			const crew = mates.flatMap((m) => (m.image ? [m.image] : []));
			return { run: { ...DEMO_RUN, crew }, isDemo: true };
		}
		const km = lastResult?.km ?? 0;
		return {
			isDemo: false,
			run: {
				seconds: lastResult?.seconds ?? 0,
				km,
				points: lastResult?.saved?.points ?? provisionalPoints(km),
				route: (lastResult?.points ?? []).map((p) => [p.lat, p.lng] as const),
				team: storyTeam(team),
				crew: crewOf(myPhoto, teamRun),
				members: (team?.members ?? []).map((m) => ({
					name: m.name,
					km: m.km,
					isYou: Boolean(m.you),
				})),
			},
		};
	}, [lastResult, team, mates, myPhoto, teamRun]);
};
