import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IRunResult, useRunReviewStore, useRunStore } from "@/lib/run";
import { ISavedRun, ISaveRunPayload, saveRun } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

// Corrida terminada no aparelho → dados para salvar no banco
export const runPayload = (result: IRunResult): ISaveRunPayload => ({
	mode: result.mode,
	seconds: result.seconds,
	km: result.km,
	finishedAt: result.finishedAt,
	route: result.points.map((p) => [p.lat, p.lng] as const),
});

const previewSave = (payload: ISaveRunPayload): Promise<ISavedRun> =>
	Promise.resolve({
		id: `preview-${String(payload.finishedAt)}`,
		startedAt: new Date(payload.finishedAt - payload.seconds * 1000).toISOString(),
		seconds: payload.seconds,
		km: payload.km,
		status: "pending",
		points: Math.floor(Math.min(payload.km, 20) * 8),
		route: payload.route.map(([lat, lng]) => [lat, lng]),
	});

// Salva a corrida; o banco valida e pontua. Guarda o resultado na última
// corrida (resumo) e recarrega números, equipe e ranking.
export const useSaveRun = () => {
	const client = useQueryClient();

	return useMutation({
		mutationFn: (payload: ISaveRunPayload) =>
			IS_PREVIEW ? previewSave(payload) : saveRun(payload),
		onSuccess: (saved) => {
			useRunStore
				.getState()
				.setLastSaved({ id: saved.id, status: saved.status, points: saved.points });
			// Corrida do app já passou pelo resumo: não abre o aviso do Buddy
			useRunReviewStore.getState().markReviewed(saved.id);
			void client.invalidateQueries({ queryKey: DATA_KEYS.myStats });
			void client.invalidateQueries({ queryKey: DATA_KEYS.myRuns });
			void client.invalidateQueries({ queryKey: DATA_KEYS.myTeam });
			void client.invalidateQueries({ queryKey: DATA_KEYS.rankingAll });
			void client.invalidateQueries({ queryKey: DATA_KEYS.teamLiveAll });
			void client.invalidateQueries({ queryKey: DATA_KEYS.notifications });
			void client.invalidateQueries({ queryKey: DATA_KEYS.challenges });
		},
	});
};
