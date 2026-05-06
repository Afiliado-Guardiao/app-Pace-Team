import { StateCreator } from "zustand";

import { INavigationSlice, IStore } from "../../types";

export const createNavigationSlice: StateCreator<IStore, [], [], INavigationSlice> = (set) => ({
	lastRoute: null,
	setLastRoute: (route) => {
		set({ lastRoute: route });
	},
});
