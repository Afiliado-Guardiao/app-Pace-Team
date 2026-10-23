import { useQuery } from "@tanstack/react-query";

import { IRun, RUNS } from "@/lib/pace";
import { getMyRuns, ISavedRun } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";
import { toRun } from "./mappers";

interface IMyRunsData {
	runs: IRun[];
	// Percursos salvos, na mesma ordem (mapa e detalhe)
	saved: ISavedRun[];
}

const fetchRuns = async (): Promise<IMyRunsData> => {
	if (IS_PREVIEW) return { runs: [...RUNS], saved: [] };
	const saved = await getMyRuns();
	return { runs: saved.map(toRun), saved };
};

// Minhas corridas, da mais recente para a mais antiga.
export const useMyRuns = (): IMyRunsData & { isLoading: boolean } => {
	const query = useQuery({ queryKey: DATA_KEYS.myRuns, queryFn: fetchRuns });
	return {
		runs: query.data?.runs ?? [],
		saved: query.data?.saved ?? [],
		isLoading: query.isLoading,
	};
};
