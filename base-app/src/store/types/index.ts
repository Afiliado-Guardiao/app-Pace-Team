import { IUser } from "@/lib/supabase/types";

import { IOnboardingSlice } from "../slices/onboarding";

export type { IUser };

export interface ILanguageSlice {
	language: "pt-BR" | "en-US" | "es-ES" | null;
	setLanguage: (language: "pt-BR" | "en-US" | "es-ES") => void;
}

export interface INavigationSlice {
	lastRoute: string | null;
	setLastRoute: (route: string) => void;
}

export interface IAuthSlice {
	user: IUser | null;
	isAuthenticated: boolean;
	hasSeenReferralPrompt: boolean;
	setUser: (user: IUser | null) => void;
	setHasSeenReferralPrompt: (value: boolean) => void;
}

export interface IHydrationSlice {
	_hasHydrated: boolean;
	setHasHydrated: (state: boolean) => void;
}

export interface IStore
	extends ILanguageSlice,
		INavigationSlice,
		IAuthSlice,
		IHydrationSlice,
		IOnboardingSlice {}
