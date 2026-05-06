import * as Crypto from "expo-crypto";

import { StateCreator } from "zustand";

import { IStore } from "../../types";

import { IOnboardingAnswers, IOnboardingSlice } from "./types";

export const createOnboardingSlice: StateCreator<IStore, [], [], IOnboardingSlice> = (
	set,
	get,
): IOnboardingSlice => ({
	currentStepIndex: 0,
	answers: {},
	isCompleted: false,
	onboardingId: null,
	anonymousUserId: null,
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
	setOnboardingId: (id: string | null): void => {
		set({ onboardingId: id });
	},
	getOrGenerateAnonymousUserId: (): string => {
		const currentId = get().anonymousUserId;

		if (currentId) {
			return currentId;
		}

		const newId = Crypto.randomUUID();
		set({ anonymousUserId: newId });
		return newId;
	},
	resetOnboarding: (): void => {
		set({
			currentStepIndex: 0,
			answers: {},
			isCompleted: false,
			onboardingId: null,
		});
	},
});

export * from "./types";
