import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, PersistOptions } from "zustand/middleware";

import { IStore } from "../types";

export const persistConfig: PersistOptions<IStore, Partial<IStore>> = {
	name: "@app-base:store",
	storage: createJSONStorage(() => AsyncStorage),
	version: 1,
	migrate: (_persistedState: unknown, _version: number): Partial<IStore> => {
		// Versão incrementada — descarta estado persistido pra limpar formato antigo
		return {};
	},
	partialize: (state) => ({
		language: state.language,
		lastRoute: state.lastRoute,
		token: state.token,
		user: state.user,
		isAuthenticated: state.isAuthenticated,
		hasSeenReferralPrompt: state.hasSeenReferralPrompt,
		anonymousUserId: state.anonymousUserId,
		currentStepIndex: state.currentStepIndex,
		answers: state.answers,
		isCompleted: state.isCompleted,
		onboardingId: state.onboardingId,
	}),
	onRehydrateStorage:
		() =>
		(state): void => {
			state?.setHasHydrated(true);
		},
};
