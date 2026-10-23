import { useQuery } from "@tanstack/react-query";

import { getMyStats, IMyStats } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

// Números do atleta (Início, Perfil, Histórico); a prévia usa os do design.
export const DEMO_STATS: IMyStats = {
	runs: 86,
	km: 742,
	avgPace: 318,
	weekKm: 32.4,
	weekPoints: 512,
	weekRuns: 4,
	monthKm: 36.5,
	monthRuns: 4,
	monthPoints: 266,
	weekDays: [6, 0, 10.6, 0, 6.2, 0, 15.6],
	monthWeeks: [38, 52, 41, 60],
};

const EMPTY_STATS: IMyStats = {
	runs: 0,
	km: 0,
	avgPace: 0,
	weekKm: 0,
	weekPoints: 0,
	weekRuns: 0,
	monthKm: 0,
	monthRuns: 0,
	monthPoints: 0,
	weekDays: [0, 0, 0, 0, 0, 0, 0],
	monthWeeks: [0, 0, 0, 0],
};

const fetchStats = async (): Promise<IMyStats> => (IS_PREVIEW ? DEMO_STATS : getMyStats());

export const useMyStats = (): { stats: IMyStats; isLoading: boolean } => {
	const query = useQuery({ queryKey: DATA_KEYS.myStats, queryFn: fetchStats });
	return { stats: query.data ?? EMPTY_STATS, isLoading: query.isLoading };
};
