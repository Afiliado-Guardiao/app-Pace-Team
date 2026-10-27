import { useCallback, useState } from "react";

import { useFocusEffect } from "expo-router";

import { useReducedMotion } from "react-native-reanimated";

import { IBuddyPose } from "../../BuddyFigure";

const WAVE_MS = 1800;
const REST_MS = 3600;

const IDLE: IBuddyPose = { act: "idle", phase: null, blink: false, gx: 0, gy: 0 };
const WAVE: IBuddyPose = { ...IDLE, act: "wave" };

interface IUseBuddyWaveReturn {
	pose: IBuddyPose;
}

// Buddy do botão do Perfil: dá tchau, descansa um pouco e acena de novo
export const useBuddyWave = (): IUseBuddyWaveReturn => {
	const isReduced = useReducedMotion();
	const [isWaving, setIsWaving] = useState(false);

	useFocusEffect(
		useCallback(() => {
			if (isReduced) return undefined;
			let timer: ReturnType<typeof setTimeout>;
			const cycle = (wave: boolean) => {
				setIsWaving(wave);
				timer = setTimeout(
					() => {
						cycle(!wave);
					},
					wave ? WAVE_MS : REST_MS,
				);
			};
			cycle(true);
			return () => {
				clearTimeout(timer);
				setIsWaving(false);
			};
		}, [isReduced]),
	);

	return { pose: isWaving ? WAVE : IDLE };
};
