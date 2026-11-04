import { useQuery } from "@tanstack/react-query";

import { avatarUrlOf, getTeamRun, ITeamRunDetail } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

// Quem correu junto, com a foto no fim do percurso de cada um
export interface ITeamRunMateView {
	name: string;
	isYou: boolean;
	// Ainda correndo: os números são até agora e mudam sozinhos
	isLive: boolean;
	km: number;
	seconds: number;
	avatarUrl: string | null;
	route: [number, number][];
}

export interface ITeamRunView extends Omit<ITeamRunDetail, "mates" | "avatarPath"> {
	avatarUrl: string | null;
	mates: ITeamRunMateView[];
}

interface IUseTeamRunReturn {
	run: ITeamRunView | null;
	isLoading: boolean;
}

const photo = (path: string | null): string | null => (path ? avatarUrlOf(path) : null);

const toView = (run: ITeamRunDetail): ITeamRunView => ({
	...run,
	avatarUrl: photo(run.avatarPath),
	mates: run.mates.map((m) => ({
		name: m.name,
		isYou: m.isYou,
		isLive: m.isLive ?? false,
		km: m.km,
		seconds: m.seconds,
		avatarUrl: photo(m.avatarPath),
		route: m.route,
	})),
});

// Busca de novo enquanto alguém ainda corre ou a corrida acabou há pouco:
// quem termina primeiro vê o colega chegar (e os números dele virarem finais)
const REFRESH_MS = 10_000;
const RECENT_MS = 15 * 60_000;

const shouldRefresh = (run: ITeamRunDetail | null | undefined): boolean => {
	if (!run) return false;
	if (run.mates.some((m) => m.isLive)) return true;
	const finishedAt = new Date(run.startedAt).getTime() + run.seconds * 1000;
	return Date.now() - finishedAt < RECENT_MS;
};

// Uma corrida da equipe (aberta pelo aviso ou pelo Histórico › Equipe)
export const useTeamRun = (id: string | undefined): IUseTeamRunReturn => {
	const query = useQuery({
		queryKey: DATA_KEYS.teamRun(id ?? ""),
		queryFn: () => getTeamRun(id ?? ""),
		enabled: Boolean(id) && !IS_PREVIEW,
		refetchInterval: (q) => (shouldRefresh(q.state.data) ? REFRESH_MS : false),
	});
	const data = query.data ?? null;
	return { run: data ? toView(data) : null, isLoading: query.isLoading };
};
