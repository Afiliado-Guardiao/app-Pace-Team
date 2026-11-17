import { useCallback, useEffect } from "react";
import { AppState } from "react-native";

import { QueryClient, useQueryClient } from "@tanstack/react-query";

import { syncWatchRuns, useWatchStore } from "@/lib/health";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

// Corrida nova do relógio mexe nos mesmos números que uma corrida do app
const refreshAfterImport = (client: QueryClient): void => {
	for (const key of [
		DATA_KEYS.myStats,
		DATA_KEYS.myRuns,
		DATA_KEYS.myTeam,
		DATA_KEYS.rankingAll,
		DATA_KEYS.teamLiveAll,
		DATA_KEYS.notifications,
		DATA_KEYS.challenges,
	]) {
		void client.invalidateQueries({ queryKey: key });
	}
	void client.invalidateQueries({ queryKey: ["pace", "team-achievements"] });
};

interface IUseWatchSyncReturn {
	// Busca agora; devolve quantas corridas entraram (0 se falhar)
	syncNow: () => Promise<number>;
}

// Relógio conectado: busca as corridas novas do app Saúde quando o app abre
// e sempre que volta para a frente.
export const useWatchSync = (isAuto = false): IUseWatchSyncReturn => {
	const client = useQueryClient();
	const isConnected = useWatchStore((s) => s.connectedAt !== null);

	const syncNow = useCallback(async (): Promise<number> => {
		if (IS_PREVIEW || !useWatchStore.getState().connectedAt) return 0;
		try {
			const imported = await syncWatchRuns();
			if (imported > 0) refreshAfterImport(client);
			return imported;
		} catch {
			return 0;
		}
	}, [client]);

	useEffect(() => {
		if (!isAuto || !isConnected) return;
		void syncNow();
		const sub = AppState.addEventListener("change", (state) => {
			if (state === "active") void syncNow();
		});
		return () => {
			sub.remove();
		};
	}, [isAuto, isConnected, syncNow]);

	return { syncNow };
};
