import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { useBuddyLive } from "./liveStore";

// Última posição da equipe que o atleta viu em cada ranking (escopo +
// categoria). Na próxima vez que abrir, o Buddy comemora se subiu e fica
// cabisbaixo se caiu.
interface IBuddyRankState {
	seen: Partial<Record<string, number>>;
	noteRank: (key: string, position: number) => void;
}

export const useBuddyRankStore = create<IBuddyRankState>()(
	persist(
		(set, get) => ({
			seen: {},
			noteRank: (key, position) => {
				const before = get().seen[key];
				if (before === position) return;
				set({ seen: { ...get().seen, [key]: position } });
				if (before === undefined) return;
				useBuddyLive.getState().emit(position < before ? "rankUp" : "rankDown");
			},
		}),
		{
			name: "@pace-team:buddy-rank",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
