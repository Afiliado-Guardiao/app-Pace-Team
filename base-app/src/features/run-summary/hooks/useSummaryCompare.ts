import { useMemo } from "react";

import { runDate, useRouteComparison } from "@/lib/data";
import { IRouteComparison } from "@/lib/run";

interface ISummaryRun {
	runId: string | null;
	startedAt: Date | null;
	seconds: number;
	km: number;
	route: readonly (readonly [number, number])[];
	canShare: boolean;
}

interface IUseSummaryCompareReturn {
	comparison: IRouteComparison | null;
	// "Ter, 27 out · 10:50" — quando foi a vez anterior
	previousDate: string;
	// Bateu o próprio tempo: confetes
	isRecord: boolean;
}

// Mesmo percurso de antes? Compara a corrida (só as minhas) com a última vez.
export const useSummaryCompare = (run: ISummaryRun): IUseSummaryCompareReturn => {
	const { runId, startedAt, seconds, km, route, canShare } = run;
	const routeRun = useMemo(
		() =>
			startedAt && canShare
				? { id: runId ?? "agora", startedAt: startedAt.toISOString(), seconds, km, route }
				: null,
		[runId, startedAt, seconds, km, route, canShare],
	);
	const comparison = useRouteComparison(routeRun);
	return {
		comparison,
		previousDate: comparison ? runDate(new Date(comparison.previous.startedAt)) : "",
		isRecord: Boolean(comparison?.isFaster),
	};
};
