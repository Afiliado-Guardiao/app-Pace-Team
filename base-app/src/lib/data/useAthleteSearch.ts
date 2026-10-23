import { useQuery } from "@tanstack/react-query";

import { PEOPLE } from "@/lib/pace";
import { IAthleteResult, searchAthletes } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

const DEMO_ATHLETES: IAthleteResult[] = PEOPLE.map((p) => ({
	id: p.handle,
	name: p.name,
	handle: p.handle,
	hasTeam: false,
}));

const fetchAthletes = async (query: string): Promise<IAthleteResult[]> =>
	IS_PREVIEW ? DEMO_ATHLETES : searchAthletes(query);

// Atletas para convidar (nome ou @).
export const useAthleteSearch = (query: string): { athletes: IAthleteResult[] } => {
	const trimmed = query.trim();
	const result = useQuery({
		queryKey: DATA_KEYS.athletes(trimmed),
		queryFn: () => fetchAthletes(trimmed),
		staleTime: 30_000,
	});
	return { athletes: result.data ?? [] };
};
