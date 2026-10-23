import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { distanceMeters, GPS_FILTER, IRunPoint, isValidStep } from "./geo";

export type IRunStatus = "idle" | "running" | "paused";
export type IRunMode = "free" | "dist" | "time" | "team";

export interface IRunGoal {
	km: number;
	min: number;
	// segundos por km
	pace: number;
}

// Resultado do servidor depois de salvar (validação e pontos)
export interface IRunSaved {
	id: string;
	status: "pending" | "valid" | "invalid";
	points: number;
}

export interface IRunResult {
	seconds: number;
	km: number;
	points: IRunPoint[];
	mode: IRunMode;
	finishedAt: number;
	// null até o banco confirmar o salvamento
	saved?: IRunSaved | null;
}

interface IRunState {
	status: IRunStatus;
	mode: IRunMode;
	goal: IRunGoal;
	points: IRunPoint[];
	meters: number;
	// Tempo acumulado antes do trecho atual (ms) e início do trecho atual
	elapsedBefore: number;
	segmentStart: number | null;
	lastResult: IRunResult | null;
	setMode: (mode: IRunMode) => void;
	setGoal: (goal: IRunGoal) => void;
	start: () => void;
	pause: () => void;
	resume: () => void;
	finish: () => IRunResult;
	reset: () => void;
	addLocations: (points: IRunPoint[]) => void;
	setLastSaved: (saved: IRunSaved) => void;
}

export const DEFAULT_GOAL: IRunGoal = { km: 5, min: 30, pace: 360 };

// Tempo de corrida em segundos (conta só enquanto está correndo)
export const elapsedSeconds = (
	state: Pick<IRunState, "elapsedBefore" | "segmentStart">,
	now = Date.now(),
): number => (state.elapsedBefore + (state.segmentStart ? now - state.segmentStart : 0)) / 1000;

// Estado da corrida em andamento. Fica salvo no aparelho: se o app for
// fechado no meio da corrida, ela continua de onde estava ao reabrir.
export const useRunStore = create<IRunState>()(
	persist(
		(set, get) => ({
			status: "idle",
			mode: "free",
			goal: DEFAULT_GOAL,
			points: [],
			meters: 0,
			elapsedBefore: 0,
			segmentStart: null,
			lastResult: null,
			setLastSaved: (saved) => {
				const last = get().lastResult;
				if (last) set({ lastResult: { ...last, saved } });
			},
			setMode: (mode) => {
				set({ mode });
			},
			setGoal: (goal) => {
				set({ goal });
			},
			start: () => {
				set({
					status: "running",
					points: [],
					meters: 0,
					elapsedBefore: 0,
					segmentStart: Date.now(),
				});
			},
			pause: () => {
				const s = get();
				if (s.status !== "running") return;
				set({ status: "paused", elapsedBefore: elapsedSeconds(s) * 1000, segmentStart: null });
			},
			resume: () => {
				if (get().status !== "paused") return;
				set({ status: "running", segmentStart: Date.now() });
			},
			finish: () => {
				const s = get();
				const result: IRunResult = {
					seconds: elapsedSeconds(s),
					km: s.meters / 1000,
					points: s.points,
					mode: s.mode,
					finishedAt: Date.now(),
				};
				set({ status: "idle", segmentStart: null, elapsedBefore: 0, lastResult: result });
				return result;
			},
			reset: () => {
				set({ status: "idle", points: [], meters: 0, elapsedBefore: 0, segmentStart: null });
			},
			addLocations: (incoming) => {
				const s = get();
				if (s.status !== "running" || incoming.length === 0) return;
				const points = [...s.points];
				let meters = s.meters;
				for (const raw of incoming) {
					const last = points.at(-1);
					if ((raw.accuracy ?? 0) > GPS_FILTER.maxAccuracy) continue;
					if (!last || last.t < (s.segmentStart ?? 0)) {
						points.push({ ...raw, resume: points.length > 0 });
						continue;
					}
					if (!isValidStep(last, raw)) continue;
					meters += distanceMeters(last, raw);
					points.push(raw);
				}
				set({ points, meters });
			},
		}),
		{
			name: "@pace-team:run",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (s) => ({
				status: s.status,
				mode: s.mode,
				goal: s.goal,
				points: s.points,
				meters: s.meters,
				elapsedBefore: s.elapsedBefore,
				segmentStart: s.segmentStart,
				lastResult: s.lastResult,
			}),
		},
	),
);
