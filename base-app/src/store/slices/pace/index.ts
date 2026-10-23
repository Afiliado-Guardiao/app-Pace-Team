import { StateCreator } from "zustand";

import { IPaceSlice, IStore } from "../../types";

const MAX_MY_POSTS = 5;

// Estado local do PACE TEAM enquanto equipes e disputas não vêm do Supabase:
// se o atleta já tem equipe e o cenário do Modo Virada (simulado no protótipo).
export const createPaceSlice: StateCreator<IStore, [], [], IPaceSlice> = (set): IPaceSlice => ({
	hasTeam: true,
	viradaState: "equal",
	hasSeenVirada: false,
	myPosts: [],
	hasJustPosted: false,
	setHasTeam: (value): void => {
		set({ hasTeam: value });
	},
	setViradaState: (value): void => {
		set({ viradaState: value });
	},
	setHasSeenVirada: (value): void => {
		set({ hasSeenVirada: value });
	},
	addMyPost: (post): void => {
		set((state) => ({
			myPosts: [post, ...state.myPosts].slice(0, MAX_MY_POSTS),
			hasJustPosted: true,
		}));
	},
	setHasJustPosted: (value): void => {
		set({ hasJustPosted: value });
	},
});
