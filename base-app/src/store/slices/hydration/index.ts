import { StateCreator } from "zustand";

import { IHydrationSlice, IStore } from "../../types";

export const createHydrationSlice: StateCreator<IStore, [], [], IHydrationSlice> = (set) => ({
	_hasHydrated: false,
	setHasHydrated: (state) => {
		set({ _hasHydrated: state });
	},
});
