import { useQuery } from "@tanstack/react-query";

import { distanceParts, formatDurationText, formatPace, IRun, PHOTOS } from "@/lib/pace";
import { getTeamRuns, ITeamRunRow } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";
import { runDate, runTitle } from "./mappers";

interface IUseTeamRunListReturn {
	runs: IRun[];
	isLoading: boolean;
}

// "Dutra · Corrida da noite" (ou "Você · …" nas minhas)
const toTeamRun = (r: ITeamRunRow): IRun => {
	const date = new Date(r.startedAt);
	return {
		id: r.id,
		title: `${r.isYou ? "Você" : r.name} · ${runTitle(date)}`,
		date: runDate(date),
		km: distanceParts(r.km).value,
		unit: distanceParts(r.km).unit,
		time: formatDurationText(r.seconds),
		pace: formatPace(r.km > 0 ? r.seconds / r.km : 0),
		pts: r.points,
		status: r.status,
		image: PHOTOS.teamTrack,
		route: r.route,
	};
};

// Histórico › Equipe: corridas de todos da minha equipe, mais recentes primeiro
export const useTeamRunList = (): IUseTeamRunListReturn => {
	const query = useQuery({
		queryKey: DATA_KEYS.teamRuns,
		queryFn: () => getTeamRuns(),
		enabled: !IS_PREVIEW,
	});
	return { runs: (query.data ?? []).map(toTeamRun), isLoading: query.isLoading };
};
