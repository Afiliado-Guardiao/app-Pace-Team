import { useQuery } from "@tanstack/react-query";

import { getTeam } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";
import { DEMO_TEAM_VIEW, ITeamView, toTeamView } from "./teamView";

const fetchTeam = async (id: string): Promise<ITeamView | null> => {
	if (IS_PREVIEW) return DEMO_TEAM_VIEW;
	const team = await getTeam(id);
	return team ? toTeamView(team) : null;
};

// Qualquer equipe (Detalhes vindo do ranking); sem id usa a minha.
export const useTeam = (id: string | undefined, fallback: ITeamView | null) => {
	const query = useQuery({
		queryKey: DATA_KEYS.team(id ?? "mine"),
		queryFn: () => fetchTeam(id ?? ""),
		enabled: Boolean(id),
	});

	return { team: id ? (query.data ?? null) : fallback, isLoading: Boolean(id) && query.isLoading };
};
