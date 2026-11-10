import { useState } from "react";

import * as Haptics from "expo-haptics";

import { IBuddyPose } from "@/components/buddy";

import { SETUP_COPY } from "../constants";

interface IUseStepCareReturn {
	days: number;
	setDays: (days: number) => void;
	// 0…1 da barra de vida
	life: number;
	lifeTone: "good" | "warn" | "bad";
	mood: string;
	moodSub: string;
	pose: IBuddyPose;
	// Muda a cada "corrida" simulada (sobem os corações)
	hearts: number;
	simulateRun: () => void;
}

const MAX_DAYS = 7;
const base: IBuddyPose = { act: "idle", phase: null, blink: false, gx: 0, gy: 0 };

const moodOf = (days: number): number => {
	if (days <= 2) return 0;
	if (days <= 4) return 1;
	if (days <= 6) return 2;
	return 3;
};

const poseOf = (mood: number): IBuddyPose => {
	if (mood === 3) return { ...base, act: "sick" };
	if (mood >= 1) return { ...base, act: "tilt" };
	return base;
};

// 3c · "Cuide de mim": 7 dias sem correr e o Buddy fica doente
export const useStepCare = (): IUseStepCareReturn => {
	const [days, setDaysState] = useState(0);
	const [hearts, setHearts] = useState(0);
	const life = 1 - days / MAX_DAYS;
	const mood = moodOf(days);

	return {
		days,
		setDays: (value) => {
			void Haptics.selectionAsync().catch(() => undefined);
			setDaysState(Math.max(0, Math.min(MAX_DAYS, value)));
		},
		life,
		lifeTone: life > 0.6 ? "good" : life > 0.25 ? "warn" : "bad",
		mood: SETUP_COPY.careMoods[mood] ?? "",
		moodSub: SETUP_COPY.careMoodSubs[mood] ?? "",
		pose: poseOf(mood),
		hearts,
		simulateRun: () => {
			void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
				() => undefined,
			);
			setDaysState(0);
			setHearts((n) => n + 1);
		},
	};
};
