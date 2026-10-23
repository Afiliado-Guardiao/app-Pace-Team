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

export type IViradaState = "equal" | "overtaking" | "done";

// Post publicado pelo próprio atleta (local até o feed vir do Supabase).
// A foto é uma das de exemplo (`sample`) ou um arquivo da câmera (`uri`).
export interface IMyPost {
	id: string;
	sample?: number;
	uri?: string;
	seconds: number;
	km: number;
	layers: { route: boolean; stats: boolean; badge: boolean };
	caption: string;
	createdAt: number;
}

export interface IPaceSlice {
	hasTeam: boolean;
	viradaState: IViradaState;
	hasSeenVirada: boolean;
	myPosts: IMyPost[];
	hasJustPosted: boolean;
	setHasTeam: (value: boolean) => void;
	setViradaState: (value: IViradaState) => void;
	setHasSeenVirada: (value: boolean) => void;
	addMyPost: (post: IMyPost) => void;
	setHasJustPosted: (value: boolean) => void;
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
		IOnboardingSlice,
		IPaceSlice {}
