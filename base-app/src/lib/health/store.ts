import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Relógio e Apple Saúde: fica no próprio celular (cada aparelho conecta o
// seu). Corridas antigas não entram: só a partir do dia em que conectou.
interface IWatchState {
	// Quando conectou (ms); null = não conectado
	connectedAt: number | null;
	// Última busca terminada (ms)
	lastSyncAt: number | null;
	// Corridas que vieram do relógio por este aparelho
	importedCount: number;
	connect: (at: number) => void;
	disconnect: () => void;
	markSynced: (at: number, imported: number) => void;
}

export const useWatchStore = create<IWatchState>()(
	persist(
		(set) => ({
			connectedAt: null,
			lastSyncAt: null,
			importedCount: 0,
			connect: (at) => {
				set({ connectedAt: at, lastSyncAt: null });
			},
			disconnect: () => {
				set({ connectedAt: null, lastSyncAt: null });
			},
			markSynced: (at, imported) => {
				set((s) => ({ lastSyncAt: at, importedCount: s.importedCount + imported }));
			},
		}),
		{
			name: "@pace-team:watch",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (s) => ({
				connectedAt: s.connectedAt,
				lastSyncAt: s.lastSyncAt,
				importedCount: s.importedCount,
			}),
		},
	),
);
