import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Corridas que o atleta já viu no aviso de "corrida feita" (as do app já
// passam pelo resumo; as do Buddy aparecem no aviso ao abrir o app).
const MAX_REVIEWED = 60;

interface IRunReviewState {
	reviewed: string[];
	markReviewed: (id: string) => void;
}

export const useRunReviewStore = create<IRunReviewState>()(
	persist(
		(set, get) => ({
			reviewed: [],
			markReviewed: (id) => {
				const list = get().reviewed;
				if (list.includes(id)) return;
				set({ reviewed: [id, ...list].slice(0, MAX_REVIEWED) });
			},
		}),
		{ name: "@pace-team:run-review", storage: createJSONStorage(() => AsyncStorage) },
	),
);
