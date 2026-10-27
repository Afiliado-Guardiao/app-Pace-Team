import { useMyRuns } from "@/lib/data";

import { BUDDY_SICK_DAYS } from "./constants";

// Como o Buddy está hoje: doente (7 dias sem correr), comemorando (correu
// hoje) ou normal.
export type IBuddyMood = "sick" | "celebrate" | "normal";

export interface IBuddyVitals {
	mood: IBuddyMood;
	// Barrinha de vida (0…1): cheia no dia em que corre e cai um pedaço a
	// cada dia sem correr, até zerar e ele ficar doente
	life: number;
}

const DAY_MS = 86_400_000;

// Dias de calendário desde a última corrida (0 = correu hoje)
const daysSince = (time: number, now: number): number => {
	const day = (t: number) => {
		const d = new Date(t);
		return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
	};
	return Math.round((day(now) - day(time)) / DAY_MS);
};

export const vitalsOf = (lastRunAt: number | null, now: number): IBuddyVitals => {
	// Quem ainda não correu começa com a vida cheia
	if (lastRunAt === null) return { mood: "normal", life: 1 };
	const days = daysSince(lastRunAt, now);
	const life = Math.max(0, (BUDDY_SICK_DAYS - days) / BUDDY_SICK_DAYS);
	if (days >= BUDDY_SICK_DAYS) return { mood: "sick", life: 0 };
	return { mood: days === 0 ? "celebrate" : "normal", life };
};

export const useBuddyMood = (): IBuddyVitals => {
	const { saved } = useMyRuns();
	const lastRun = saved.at(0);
	const lastRunAt = lastRun ? new Date(lastRun.startedAt).getTime() : null;
	return vitalsOf(lastRunAt, Date.now());
};
