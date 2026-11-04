import { useMemo } from "react";

import { buildRunCrew, IRunCrewPin, useTeamRun } from "@/lib/data";
import { useRunStore } from "@/lib/run";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";

interface IPostTrack {
	route: readonly (readonly [number, number])[];
	crew: IRunCrewPin[];
}

// Percurso real da última corrida e quem correu junto (se foi com a equipe):
// foto, nome e km de cada um. Na prévia por link fica o traçado do design.
export const usePostTrack = (): IPostTrack | undefined => {
	const lastResult = useRunStore((s) => s.lastResult);
	const myPhoto = useStore((s) => s.user?.avatarUrl ?? null);
	const myName = useStore((s) => s.user?.name ?? "");
	const savedId = lastResult?.mode === "team" ? lastResult.saved?.id : undefined;
	const { run: teamRun } = useTeamRun(savedId);

	return useMemo(() => {
		if (IS_PREVIEW) return undefined;
		const route = (lastResult?.points ?? []).map((p) => [p.lat, p.lng] as const);
		return buildRunCrew(
			{
				name: myName || (teamRun?.name ?? ""),
				photo: myPhoto ?? teamRun?.avatarUrl ?? null,
				km: lastResult?.km ?? 0,
				seconds: lastResult?.seconds ?? 0,
				route,
			},
			teamRun,
		);
	}, [lastResult, myPhoto, myName, teamRun]);
};
