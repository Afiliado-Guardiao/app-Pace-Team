import { useCallback, useState } from "react";

import { IRunGoal } from "@/lib/run";

type IGoalKey = keyof IRunGoal;

const clamp = (v: number, min: number, max: number): number => Math.max(min, Math.min(max, v));

export const GOAL_LIMITS = {
	km: { min: 0.5, max: 100, step: 0.5 },
	min: { min: 1, max: 600, step: 5 },
	pace: { min: 150, max: 900, step: 5 },
} as const;

// Recalcula o valor que não foi editado por último a partir dos outros dois
const derive = (goal: IRunGoal, locked: IGoalKey[]): IRunGoal => {
	const next = { ...goal };
	const free = (["km", "min", "pace"] as IGoalKey[]).find((k) => !locked.includes(k));
	if (free === "pace") next.pace = clamp(Math.round((next.min * 60) / next.km), 150, 900);
	if (free === "min") next.min = clamp(Math.round((next.pace * next.km) / 60), 1, 600);
	if (free === "km") next.km = clamp(Math.round(((next.min * 60) / next.pace) * 10) / 10, 0.5, 100);
	return next;
};

export const parseKm = (text: string, fallback: number): number => {
	const v = parseFloat(text.replace(",", "."));
	return Number.isNaN(v) ? fallback : clamp(Math.round(v * 10) / 10, 0.5, 100);
};

export const parseMinutes = (text: string, fallback: number): number => {
	if (text.includes(":")) {
		const [h = "0", m = "0"] = text.split(":");
		return clamp(Number(h) * 60 + Number(m), 1, 600);
	}
	const v = parseInt(text, 10);
	return Number.isNaN(v) ? fallback : clamp(v, 1, 600);
};

export const parsePace = (text: string, fallback: number): number => {
	const match = /(\d+)\D+(\d+)/.exec(text);
	if (match) return clamp(Number(match[1]) * 60 + Number(match[2]), 150, 900);
	const v = parseFloat(text.replace(",", "."));
	return Number.isNaN(v) ? fallback : clamp(Math.round(v * 60), 150, 900);
};

// Meta manual: ajuste dois valores (distância, tempo, ritmo) e o terceiro é calculado.
export const useGoalEditor = (goal: IRunGoal, onChange: (goal: IRunGoal) => void) => {
	const [locked, setLocked] = useState<IGoalKey[]>(["km", "min"]);

	const apply = useCallback(
		(key: IGoalKey, value: number) => {
			const last = locked[locked.length - 1] ?? "km";
			const keep: IGoalKey[] = last === key ? locked : [last, key];
			setLocked(keep);
			onChange(derive({ ...goal, [key]: value }, keep));
		},
		[goal, locked, onChange],
	);

	const step = useCallback(
		(key: IGoalKey, direction: number) => {
			const limits = GOAL_LIMITS[key];
			const raw = goal[key] + direction * limits.step;
			apply(key, clamp(Math.round(raw * 10) / 10, limits.min, limits.max));
		},
		[goal, apply],
	);

	return { apply, step };
};
