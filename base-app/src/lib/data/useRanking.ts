import { useQuery } from "@tanstack/react-query";

import { IRankedTeam, TEAMS } from "@/lib/pace";
import { getTeamRanking, IRankingScope } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";
import { toRankedTeam } from "./mappers";

interface IUseRankingReturn {
	teams: readonly IRankedTeam[];
	isLoading: boolean;
}

const fetchRanking = async (size: number, scope: IRankingScope): Promise<IRankedTeam[]> => {
	if (IS_PREVIEW) return [...TEAMS];
	const rows = await getTeamRanking(size, scope);
	return rows.map(toRankedTeam);
};

// Ranking semanal da categoria (3, 5 ou 10) no escopo escolhido.
export const useRanking = (size: number, scope: IRankingScope): IUseRankingReturn => {
	const query = useQuery({
		queryKey: DATA_KEYS.ranking(size, scope),
		queryFn: () => fetchRanking(size, scope),
	});

	return { teams: query.data ?? [], isLoading: query.isLoading };
};
