import { StateCreator } from "zustand";

import { IAuthSlice, IStore } from "../../types";

// O estado de autenticação é derivado da sessão do Supabase. O listener em
// `useAppInitialization` chama `setUser` sempre que a sessão muda — o app
// nunca guarda token: a sessão vive no AsyncStorage gerenciado pelo Supabase.
export const createAuthSlice: StateCreator<IStore, [], [], IAuthSlice> = (set): IAuthSlice => ({
	user: null,
	isAuthenticated: false,
	hasSeenReferralPrompt: false,
	setUser: (user): void => {
		if (user) {
			set({ user, isAuthenticated: true });
		} else {
			set({ user: null, isAuthenticated: false, hasSeenReferralPrompt: false });
		}
	},
	setHasSeenReferralPrompt: (value): void => {
		set({ hasSeenReferralPrompt: value });
	},
});
