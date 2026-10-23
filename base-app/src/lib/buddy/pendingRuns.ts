import { completeBuddyGoal, saveRun } from "@/lib/supabase";

import { BUDDY_KEYS, buddyNative } from "./native";

// Corrida feita pelo atalho que não chegou ao servidor (sem internet ou sem
// login válido). Mesmo formato de BuddyPendingRun (Swift).
interface IPendingRun {
	mode: string;
	seconds: number;
	km: number;
	finishedAt: number;
	route: [number, number][];
	goalReached: boolean;
}

const isPendingRun = (value: unknown): value is IPendingRun =>
	typeof value === "object" && value !== null && "finishedAt" in value && "km" in value;

const readQueue = (): IPendingRun[] => {
	try {
		const parsed: unknown = JSON.parse(buddyNative.get(BUDDY_KEYS.pendingRuns) ?? "[]");
		return Array.isArray(parsed) ? parsed.filter(isPendingRun) : [];
	} catch {
		return [];
	}
};

// Envia a fila; o que falhar continua nela. Devolve quantas foram salvas.
export async function flushPendingRuns(): Promise<number> {
	const queue = readQueue();
	if (queue.length === 0) return 0;
	const left: IPendingRun[] = [];
	for (const run of queue) {
		try {
			await saveRun({
				mode: run.mode,
				seconds: run.seconds,
				km: run.km,
				finishedAt: run.finishedAt,
				route: run.route,
			});
		} catch {
			left.push(run);
			continue;
		}
		// A corrida já foi salva: se contar a meta falhar, não salva de novo
		if (run.goalReached) await completeBuddyGoal().catch(() => undefined);
	}
	if (left.length > 0) buddyNative.set(BUDDY_KEYS.pendingRuns, JSON.stringify(left));
	else buddyNative.remove(BUDDY_KEYS.pendingRuns);
	return queue.length - left.length;
}
