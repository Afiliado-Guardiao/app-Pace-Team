import { useCallback, useMemo } from "react";

import { useLocalSearchParams, useRouter } from "expo-router";

import { runDate, runPayload, runTitle, useMyRuns, useSaveRun } from "@/lib/data";
import { formatPace } from "@/lib/pace";
import { distanceMeters, IRunPoint, ROUTE, useRunStore } from "@/lib/run";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { FALLBACK_RESULT, RUN_SUMMARY_COPY } from "../constants";

export type IRunSummaryVariant = "summary" | "detail";
export type IRunPointsStatus = "valid" | "pending" | "invalid";

export interface ISplit {
	pace: string;
	// Largura relativa da barra (0–100); o km mais rápido é o maior
	width: number;
}

interface IRunSource {
	seconds: number;
	km: number;
	startedAt: Date | null;
	status: IRunPointsStatus;
	points: number;
	route: readonly (readonly [number, number])[];
	timedPoints: readonly IRunPoint[];
	savedId: string | null;
}

const MIN_ROUTE_POINTS = 2;
const EMPTY_RESULT = { seconds: 0, km: 0 } as const;
const KM = 1000;
const MIN_WIDTH = 40;

const provisionalPoints = (km: number): number => Math.floor(Math.min(km, 20) * 8);

// Parciais por km a partir dos pontos com horário (corrida feita neste aparelho)
const splitsOf = (points: readonly IRunPoint[]): ISplit[] => {
	const times: number[] = [];
	let meters = 0;
	let lastMark = points.at(0)?.t ?? 0;
	for (let i = 1; i < points.length; i++) {
		const prev = points.at(i - 1);
		const next = points.at(i);
		if (!prev || !next || next.resume) continue;
		meters += distanceMeters(prev, next);
		if (meters >= KM * (times.length + 1)) {
			times.push((next.t - lastMark) / 1000);
			lastMark = next.t;
		}
	}
	const fastest = Math.min(...times);
	return times.map((s) => ({
		pace: formatPace(s),
		width: Math.max(MIN_WIDTH, (fastest / s) * 100),
	}));
};

// Resumo/detalhe: a última corrida, uma do histórico (?id=) ou a de exemplo.
export const useRunSummary = (variant: IRunSummaryVariant) => {
	const router = useRouter();
	const params = useLocalSearchParams<{ mode?: string; id?: string }>();
	const lastResult = useRunStore((s) => s.lastResult);
	const { saved } = useMyRuns();
	const saveRun = useSaveRun();
	const isDetail = variant === "detail";
	const isGroup = params.mode === "team";

	const source = useMemo((): IRunSource => {
		const fromHistory = params.id ? saved.find((r) => r.id === params.id) : undefined;
		if (fromHistory) {
			return {
				...fromHistory,
				startedAt: new Date(fromHistory.startedAt),
				timedPoints: [],
				savedId: fromHistory.id,
			};
		}
		if (lastResult && lastResult.km > 0) {
			return {
				seconds: lastResult.seconds,
				km: lastResult.km,
				startedAt: new Date(lastResult.finishedAt - lastResult.seconds * 1000),
				status: lastResult.saved?.status ?? "pending",
				points: lastResult.saved?.points ?? provisionalPoints(lastResult.km),
				route: lastResult.points.map((p) => [p.lat, p.lng] as const),
				timedPoints: lastResult.points,
				savedId: lastResult.saved?.id ?? null,
			};
		}
		// Sem corrida (ex.: histórico ainda carregando): zeros no app real e a
		// corrida de exemplo do design só na prévia por link
		const fallback = IS_PREVIEW ? FALLBACK_RESULT : EMPTY_RESULT;
		return {
			...fallback,
			startedAt: null,
			status: "pending",
			points: provisionalPoints(fallback.km),
			route: [],
			timedPoints: [],
			savedId: null,
		};
	}, [params.id, saved, lastResult]);

	const splits = useMemo(() => splitsOf(source.timedPoints), [source.timedPoints]);
	const emptyMeta = IS_PREVIEW ? RUN_SUMMARY_COPY.demoMeta : "";
	const emptyTitle = IS_PREVIEW ? RUN_SUMMARY_COPY.morning : RUN_SUMMARY_COPY.titleDetail;

	const goBack = useCallback(() => {
		if (router.canGoBack()) router.back();
		else router.replace(ROUTES.HOME);
	}, [router]);

	return {
		isGroup,
		isDetail,
		title: isDetail || isGroup ? RUN_SUMMARY_COPY.titleDetail : RUN_SUMMARY_COPY.titleDone,
		meta: source.startedAt ? runDate(source.startedAt) : emptyMeta,
		runTitle: source.startedAt ? runTitle(source.startedAt) : emptyTitle,
		seconds: source.seconds,
		km: source.km,
		points: source.points,
		status: source.status,
		splits,
		isSaving: saveRun.isPending,
		route: source.route.length >= MIN_ROUTE_POINTS || !IS_PREVIEW ? source.route : ROUTE,
		goBack,
		share: () => {
			router.push(ROUTES.RUN_SHARE);
		},
		save: () => {
			if (lastResult && !lastResult.saved && !params.id && !saveRun.isPending) {
				saveRun.mutate(runPayload(lastResult));
			}
			router.replace(ROUTES.HOME);
		},
		openDetail: () => {
			router.push({
				pathname: ROUTES.RUN_DETAIL,
				params: source.savedId ? { id: source.savedId } : {},
			});
		},
	};
};
