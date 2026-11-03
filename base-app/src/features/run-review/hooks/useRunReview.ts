import { useMemo, useState } from "react";

import { useRouter } from "expo-router";

import {
	runDate,
	setLastRun,
	useDeleteRun,
	useMyRuns,
	useRouteComparison,
	useTeamRuns,
} from "@/lib/data";
import { distanceParts, durationParts, formatPace, formatSpeed } from "@/lib/pace";
import { useRunReviewStore } from "@/lib/run";
import { ISavedRun } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { REVIEW_WINDOW_MS } from "../constants";

// Corrida feita pelo Buddy (fora do app) que o atleta ainda não viu
const pendingReview = (saved: readonly ISavedRun[], reviewed: readonly string[]) => {
	const last = saved.at(0);
	if (!last || reviewed.includes(last.id)) return null;
	const age = Date.now() - new Date(last.startedAt).getTime();
	return age <= REVIEW_WINDOW_MS ? last : null;
};

// Aviso ao abrir o app depois de correr com o Buddy: percurso, números,
// ficha da equipe e validar / descartar / compartilhar / postar.
export const useRunReview = () => {
	const router = useRouter();
	const { saved } = useMyRuns();
	const reviewed = useRunReviewStore((s) => s.reviewed);
	const markReviewed = useRunReviewStore((s) => s.markReviewed);
	const { view: team } = useTeamRuns();
	const deleteRun = useDeleteRun();
	const [isConfirming, setIsConfirming] = useState(false);
	const run = useMemo(
		() => (IS_PREVIEW ? null : pendingReview(saved, reviewed)),
		[saved, reviewed],
	);
	const isTeam = run?.mode === "team" && team.hasRuns;
	// Mesmo percurso de antes: mais rápido ou mais lento que a última vez
	const comparison = useRouteComparison(run);

	const done = (): void => {
		setIsConfirming(false);
		if (run) markReviewed(run.id);
	};
	const openAfter = (route: string): void => {
		if (!run) return;
		setLastRun(run);
		done();
		router.push(route);
	};

	return {
		isOpen: run !== null,
		isConfirming,
		isDiscarding: deleteRun.isPending,
		isInvalid: run?.status === "invalid",
		status: run?.status ?? "pending",
		points: run?.points ?? 0,
		date: run ? runDate(new Date(run.startedAt)) : "",
		route: run?.route ?? [],
		stats: {
			distance: distanceParts(run?.km ?? 0),
			time: durationParts(run?.seconds ?? 0),
			pace: formatPace(run && run.km > 0 ? run.seconds / run.km : 0),
			speed: formatSpeed(run?.km ?? 0, run?.seconds ?? 0),
		},
		team: isTeam ? team.members : [],
		comparison,
		previousDate: comparison ? runDate(new Date(comparison.previous.startedAt)) : "",
		isRecord: Boolean(comparison?.isFaster),
		close: done,
		validate: done,
		askDiscard: () => {
			setIsConfirming(true);
		},
		cancelDiscard: () => {
			setIsConfirming(false);
		},
		discard: () => {
			if (!run) return;
			deleteRun.mutate(run.id, { onSuccess: done });
		},
		share: () => {
			openAfter(ROUTES.RUN_SHARE);
		},
		post: () => {
			openAfter(ROUTES.RUN_POST);
		},
	};
};
