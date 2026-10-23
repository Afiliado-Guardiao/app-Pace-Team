import { useQuery } from "@tanstack/react-query";

import { getMyTeam } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";
import { DEMO_TEAM_VIEW, ITeamView, toTeamView } from "./teamView";

interface IUseMyTeamReturn {
	team: ITeamView | null;
	isLoading: boolean;
	refetch: () => void;
}

const fetchMyTeam = async (): Promise<ITeamView | null> => {
	if (IS_PREVIEW) return DEMO_TEAM_VIEW;
	const team = await getMyTeam();
	return team ? toTeamView(team) : null;
};

// Minha equipe (null = ainda sem time).
export const useMyTeam = (): IUseMyTeamReturn => {
	const query = useQuery({ queryKey: DATA_KEYS.myTeam, queryFn: fetchMyTeam });

	return {
		team: query.data ?? null,
		isLoading: query.isLoading,
		refetch: () => {
			void query.refetch();
		},
	};
};
