import { create } from "zustand";
import { persist } from "zustand/middleware";

import { persistConfig } from "../config";
import { createAuthSlice } from "../slices/auth";
import { createHydrationSlice } from "../slices/hydration";
import { createLanguageSlice } from "../slices/language";
import { createNavigationSlice } from "../slices/navigation";
import { createOnboardingSlice } from "../slices/onboarding";
import { createPaceSlice } from "../slices/pace";
import { IStore } from "../types";

export const useStore = create<IStore>()(
	persist(
		(...a) => ({
			...createLanguageSlice(...a),
			...createNavigationSlice(...a),
			...createAuthSlice(...a),
			...createHydrationSlice(...a),
			...createOnboardingSlice(...a),
			...createPaceSlice(...a),
		}),
		persistConfig,
	),
);
