import { importWatchRun } from "@/lib/supabase";

import { syncStart, toWatchRun } from "./convert";
import { fetchRunningWorkouts } from "./native";
import { useWatchStore } from "./store";

let running: Promise<number> | null = null;

const importAll = async (): Promise<number> => {
	const { connectedAt, lastSyncAt, markSynced } = useWatchStore.getState();
	if (connectedAt === null) return 0;
	const startedSync = Date.now();
	const workouts = await fetchRunningWorkouts(syncStart(connectedAt, lastSyncAt));
	let imported = 0;
	// Uma por vez: o banco recusa a repetida (mesmo código ou mesmo horário)
	for (const workout of workouts) {
		const run = toWatchRun(workout);
		if (run && (await importWatchRun(run))) imported += 1;
	}
	markSynced(startedSync, imported);
	return imported;
};

// Busca as corridas novas do relógio e manda para o PACE TEAM. Devolve
// quantas entraram. Duas chamadas juntas esperam a mesma busca.
export const syncWatchRuns = (): Promise<number> => {
	running ??= importAll().finally(() => {
		running = null;
	});
	return running;
};
