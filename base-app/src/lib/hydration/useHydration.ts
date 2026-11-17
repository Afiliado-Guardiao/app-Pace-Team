import { useMemo } from "react";

import { useMyPro, useMyRuns, useWeather } from "@/lib/data";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";

import { drankOn, IHydroDay, isThirstyNow, isToday, lastWeek, startOfDay } from "./day";
import {
	dailyBaseMl,
	dayTargetMl,
	duringAdvice,
	IDuringAdvice,
	IHydroBody,
	IHydroRun,
	IRunHydration,
	personalSweatRate,
	preRunMl,
	runHydration,
} from "./estimate";
import { IHydroLog, useHydrationStore } from "./store";

export interface IRunWithHydration {
	run: IHydroRun;
	hydration: IRunHydration;
}

export interface IUseHydrationReturn {
	isPro: boolean;
	body: IHydroBody;
	needsBody: boolean;
	hasRestriction: boolean;
	baseMl: number;
	// Estimativa de hoje (null com orientação médica: sem meta)
	targetMl: number | null;
	drankMl: number;
	remainingMl: number;
	progress: number;
	todayLogs: IHydroLog[];
	week: IHydroDay[];
	runsToday: IRunWithHydration[];
	// Última corrida das últimas 24 h (para a reposição)
	lastRun: IRunWithHydration | null;
	preRun: { min: number; max: number };
	during: IDuringAdvice;
	personalRate: number | null;
	isThirsty: boolean;
}

const DAY_MS = 86_400_000;

export const ageOf = (birthday: string | null | undefined, now: number): number | null => {
	if (!birthday) return null;
	const b = new Date(birthday).getTime();
	return Number.isFinite(b) ? Math.floor((now - b) / (365.25 * DAY_MS)) : null;
};

// Tudo o que a hidratação precisa saber agora: estimativa do dia (base +
// corridas de hoje), quanto já bebeu, corrida recente e se o Bud está com sede
export const useHydration = (): IUseHydrationReturn => {
	const { isPro } = useMyPro();
	const { saved } = useMyRuns();
	const weather = useWeather();
	const birthday = useStore((s) => s.user?.birthday);
	const st = useHydrationStore();
	const now = Date.now();
	const today = startOfDay(now);

	return useMemo(() => {
		const body: IHydroBody = {
			weightKg: st.body.weightKg,
			heightCm: st.body.heightCm,
			age: st.body.age ?? ageOf(birthday, now),
		};
		const withH = (run: IHydroRun): IRunWithHydration => ({
			run,
			hydration: runHydration({ run, body, tempC: weather.temp, tests: st.tests }),
		});
		const runs = saved.filter((r) => r.status === "valid");
		const runsToday = runs.filter((r) => isToday(new Date(r.startedAt).getTime(), now)).map(withH);
		const recent = runs.find((r) => now - new Date(r.startedAt).getTime() < DAY_MS);
		const baseMl = dailyBaseMl(body);
		const target = dayTargetMl(
			baseMl,
			runsToday.reduce((s, r) => s + r.hydration.replaceMl, 0),
		);
		const targetMl = st.hasRestriction ? null : target;
		const drankMl = drankOn(st.logs, today);
		const lastMinutes = runs.slice(0, 5).map((r) => r.seconds / 60);
		const typicalMin = lastMinutes.length
			? lastMinutes.reduce((a, b) => a + b, 0) / lastMinutes.length
			: 30;
		return {
			isPro: IS_PREVIEW || isPro,
			body,
			needsBody: !st.body.weightKg,
			hasRestriction: st.hasRestriction,
			baseMl,
			targetMl,
			drankMl,
			remainingMl: targetMl === null ? 0 : Math.max(0, targetMl - drankMl),
			progress: targetMl ? Math.min(1, drankMl / targetMl) : 0,
			todayLogs: st.logs.filter((l) => l.at >= today),
			week: lastWeek(st.logs, now),
			runsToday,
			lastRun: recent ? withH(recent) : null,
			preRun: preRunMl(body),
			during: duringAdvice(typicalMin),
			personalRate: personalSweatRate(st.tests),
			isThirsty: targetMl !== null && isThirstyNow({ drankMl, targetMl, now }),
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps -- "agora" muda a cada render; o dia basta
	}, [isPro, saved, weather.temp, birthday, st, today]);
};
