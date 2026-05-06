import { StateCreator } from "zustand";

import { ILanguageSlice, IStore } from "../../types";

export const createLanguageSlice: StateCreator<IStore, [], [], ILanguageSlice> = (set) => ({
	language: null,
	setLanguage: (language) => {
		set({ language });
	},
});
