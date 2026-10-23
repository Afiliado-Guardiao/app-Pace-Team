import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, PersistOptions } from "zustand/middleware";

import { IStore } from "../types";

export const persistConfig: PersistOptions<IStore, Partial<IStore>> = {
	name: "@pace-team:store",
	storage: createJSONStorage(() => AsyncStorage),
	version: 2,
	migrate: (_persistedState: unknown, _version: number): Partial<IStore> => {
		// Versão incrementada — descarta estado persistido pra limpar formato antigo
		return {};
	},
	// user/isAuthenticated NÃO são persistidos: derivam da sessão do Supabase,
	// que já é guardada no AsyncStorage pelo próprio cliente supabase-js.
	partialize: (state) => ({
		language: state.language,
		lastRoute: state.lastRoute,
		hasSeenReferralPrompt: state.hasSeenReferralPrompt,
		currentStepIndex: state.currentStepIndex,
		answers: state.answers,
		isCompleted: state.isCompleted,
		hasTeam: state.hasTeam,
		viradaState: state.viradaState,
		hasSeenVirada: state.hasSeenVirada,
		myPosts: state.myPosts,
	}),
	onRehydrateStorage:
		() =>
		(state): void => {
			state?.setHasHydrated(true);
		},
};
