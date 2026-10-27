import { useMemo, useState } from "react";

import { useRouter } from "expo-router";

import { runDate, useDeleteRun, useMyRuns, useTeamRuns } from "@/lib/data";
import { formatDuration, formatKm, formatPace, formatSpeed } from "@/lib/pace";
import { useRunReviewStore, useRunStore } from "@/lib/run";
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

// Coloca a corrida como "última corrida" para Compartilhar e Postar
const setAsLastResult = (run: ISavedRun): void => {
	const startedAt = new Date(run.startedAt).getTime();
	useRunStore.setState({
		lastResult: {
			seconds: run.seconds,
			km: run.km,
			points: run.route.map(([lat, lng]) => ({ lat, lng, t: startedAt })),
			mode: run.mode === "team" ? "team" : "dist",
			finishedAt: startedAt + run.seconds * 1000,
			saved: { id: run.id, status: run.status, points: run.points },
		},
	});
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

	const done = (): void => {
		setIsConfirming(false);
		if (run) markReviewed(run.id);
	};
	const openAfter = (route: string): void => {
		if (!run) return;
		setAsLastResult(run);
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
			km: formatKm(run?.km ?? 0),
			time: formatDuration(run?.seconds ?? 0),
			pace: formatPace(run && run.km > 0 ? run.seconds / run.km : 0),
			speed: formatSpeed(run?.km ?? 0, run?.seconds ?? 0),
		},
		team: isTeam ? team.members : [],
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
