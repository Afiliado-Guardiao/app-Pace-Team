import { useMemo } from "react";

import { compareWithPrevious, IRouteComparison, IRouteRun } from "@/lib/run";

import { useMyRuns } from "./useMyRuns";

// Corrida no mesmo percurso de antes? Compara com a última vez (só corridas
// validadas contam). null = primeira vez nesse caminho.
export const useRouteComparison = (run: IRouteRun | null): IRouteComparison | null => {
	const { saved } = useMyRuns();
	return useMemo(() => {
		if (!run) return null;
		const history = saved.filter((r) => r.status === "valid");
		return compareWithPrevious(run, history);
	}, [run, saved]);
};
