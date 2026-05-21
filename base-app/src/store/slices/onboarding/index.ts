import { StateCreator } from "zustand";

import { IStore } from "../../types";

import { IOnboardingAnswers, IOnboardingSlice } from "./types";

// O onboarding é identificado pela sessão (anônima) do Supabase — não há mais
// `anonymousUserId` nem `onboardingId` manuais. As respostas ficam locais e
// são gravadas no banco ao final do fluxo (ver useOnboardingSync).
export const createOnboardingSlice: StateCreator<IStore, [], [], IOnboardingSlice> = (
	set,
): IOnboardingSlice => ({
	currentStepIndex: 0,
	answers: {},
	isCompleted: false,
	setCurrentStepIndex: (index: number): void => {
		set({ currentStepIndex: index });
	},
	setAnswer: (key: keyof IOnboardingAnswers, value: string): void => {
		set((state) => ({
			answers: { ...state.answers, [key]: value },
		}));
	},
	setCompleted: (completed: boolean): void => {
		set({ isCompleted: completed });
	},
	resetOnboarding: (): void => {
		set({
			currentStepIndex: 0,
			answers: {},
			isCompleted: false,
		});
	},
});

export * from "./types";
