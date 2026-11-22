import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Roletas cujo convite já apareceu neste celular (o pop-up vem uma vez só)
interface ISeenGamesState {
	ids: string[];
	markSeen: (id: string) => void;
}

const KEEP = 20;

export const useSeenGamesStore = create<ISeenGamesState>()(
	persist(
		(set) => ({
			ids: [],
			markSeen: (id) => {
				set((s) => (s.ids.includes(id) ? s : { ids: [id, ...s.ids].slice(0, KEEP) }));
			},
		}),
		{
			name: "@pace-team:team-game-seen",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (s) => ({ ids: s.ids }),
		},
	),
);
