import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { IPrizeId } from "./catalog";

interface IPrizeState {
	// Conquistas já mostradas (o card comemorativo aparece uma vez só)
	seen: IPrizeId[];
	// Primeira leitura de quem está logado: o que já tinha não comemora
	initializedFor: string | null;
	// Prêmio aberto em tela cheia
	viewer: { id: IPrizeId; isUnlocked: boolean } | null;
	// Fila de "Nova conquista!"
	celebrate: IPrizeId[];
	openPrize: (id: IPrizeId, isUnlocked: boolean) => void;
	closePrize: () => void;
	noteUnlocked: (userId: string, unlocked: readonly IPrizeId[]) => void;
	nextCelebration: () => void;
}

export const usePrizeStore = create<IPrizeState>()(
	persist(
		(set, get) => ({
			seen: [],
			initializedFor: null,
			viewer: null,
			celebrate: [],
			openPrize: (id, isUnlocked) => set({ viewer: { id, isUnlocked } }),
			closePrize: () => set({ viewer: null }),
			noteUnlocked: (userId, unlocked) => {
				const { seen, initializedFor, celebrate } = get();
				if (initializedFor !== userId) {
					set({ initializedFor: userId, seen: [...unlocked] });
					return;
				}
				const fresh = unlocked.filter((id) => !seen.includes(id) && !celebrate.includes(id));
				if (fresh.length === 0) return;
				set({ seen: [...seen, ...fresh], celebrate: [...celebrate, ...fresh] });
			},
			nextCelebration: () => set({ celebrate: get().celebrate.slice(1) }),
		}),
		{
			name: "pace-prizes",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (s) => ({ seen: s.seen, initializedFor: s.initializedFor }),
		},
	),
);
