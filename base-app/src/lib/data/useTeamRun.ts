import { useQuery } from "@tanstack/react-query";

import { avatarUrlOf, getTeamRun, ITeamRunDetail } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

// Quem correu junto, com a foto no fim do percurso de cada um
export interface ITeamRunMateView {
	name: string;
	isYou: boolean;
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
		km: m.km,
		seconds: m.seconds,
		avatarUrl: photo(m.avatarPath),
		route: m.route,
	})),
});

// Uma corrida da equipe (aberta pelo aviso ou pelo Histórico › Equipe)
export const useTeamRun = (id: string | undefined): IUseTeamRunReturn => {
	const query = useQuery({
		queryKey: DATA_KEYS.teamRun(id ?? ""),
		queryFn: () => getTeamRun(id ?? ""),
		enabled: Boolean(id) && !IS_PREVIEW,
	});
	const data = query.data ?? null;
	return { run: data ? toView(data) : null, isLoading: query.isLoading };
};
