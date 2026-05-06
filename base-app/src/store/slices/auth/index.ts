import { StateCreator } from "zustand";

import { IAuthSlice, IStore } from "../../types";

export const createAuthSlice: StateCreator<IStore, [], [], IAuthSlice> = (set): IAuthSlice => ({
	user: null,
	token: null,
	isAuthenticated: false,
	hasHydrated: false,
	hasSeenReferralPrompt: false,
	login: (user, token): void => {
		set({
			user,
			token,
			isAuthenticated: true,
		});
	},
	logout: (): void => {
		set({
			user: null,
			token: null,
			isAuthenticated: false,
			hasSeenReferralPrompt: false,
		});
	},
	setUser: (user): void => {
		set({ user });
	},
	setHasSeenReferralPrompt: (value): void => {
		set({ hasSeenReferralPrompt: value });
	},
});
