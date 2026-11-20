import { useEffect } from "react";

import {
	cancelAnimation,
	Easing,
	SharedValue,
	useReducedMotion,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";

// Um ciclo bem longo em segundos: as ondas usam o tempo para deslizar
const CYCLE_S = 3600;

// Relógio das ondas: só anda com a seção ativa e sem "reduzir movimento"
export const useWaveClock = (isActive: boolean): SharedValue<number> => {
	const reduceMotion = useReducedMotion();
	const seconds = useSharedValue(0);
	useEffect(() => {
		if (!isActive || reduceMotion) {
			cancelAnimation(seconds);
			return undefined;
		}
		seconds.value = withRepeat(
			withTiming(seconds.value + CYCLE_S, { duration: CYCLE_S * 1000, easing: Easing.linear }),
			-1,
		);
		return () => {
			cancelAnimation(seconds);
		};
	}, [isActive, reduceMotion, seconds]);
	return seconds;
};
