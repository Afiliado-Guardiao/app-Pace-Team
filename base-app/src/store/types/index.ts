import { IUser } from "@/lib/api/types";

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
	token: string | null;
	isAuthenticated: boolean;
	hasHydrated: boolean;
	hasSeenReferralPrompt: boolean;
	login: (user: IUser, token: string) => void;
	logout: () => void;
	setUser: (user: IUser) => void;
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
