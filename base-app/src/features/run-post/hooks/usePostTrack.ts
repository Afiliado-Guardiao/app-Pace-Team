import { useMemo } from "react";
import { ImageSourcePropType } from "react-native";

import { useTeamRun } from "@/lib/data";
import { useRunStore } from "@/lib/run";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";

interface IPostTrack {
	route: readonly (readonly [number, number])[];
	crew: ImageSourcePropType[];
}

// Percurso real da última corrida e as fotos de quem correu junto (se foi
// com a equipe). Na prévia por link fica o traçado de exemplo do design.
export const usePostTrack = (): IPostTrack | undefined => {
	const lastResult = useRunStore((s) => s.lastResult);
	const myPhoto = useStore((s) => s.user?.avatarUrl ?? null);
	const savedId = lastResult?.mode === "team" ? lastResult.saved?.id : undefined;
	const { run: teamRun } = useTeamRun(savedId);

	return useMemo(() => {
		if (IS_PREVIEW) return undefined;
		const route = (lastResult?.points ?? []).map((p) => [p.lat, p.lng] as const);
		const photos = teamRun ? [myPhoto, ...teamRun.mates.map((m) => m.avatarUrl)] : [];
		const crew = photos.filter((url): url is string => Boolean(url)).map((uri) => ({ uri }));
		return { route, crew: crew.length > 1 ? crew : [] };
	}, [lastResult, myPhoto, teamRun]);
};
