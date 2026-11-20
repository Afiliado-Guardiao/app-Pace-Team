import { useEffect } from "react";

import {
	SharedValue,
	useReducedMotion,
	useSharedValue,
	withDelay,
	withTiming,
} from "react-native-reanimated";

import { GROW_EASE, GROW_MS } from "../constants";

// 0 → 1 com mola leve sempre que a seção fica ativa (barras, anéis, arcos);
// fora da seção volta a 0 para crescer de novo na próxima visita
export const useGrow = (isActive: boolean, delay = 120): SharedValue<number> => {
	const reduceMotion = useReducedMotion();
	const grow = useSharedValue(isActive && reduceMotion ? 1 : 0);
	useEffect(() => {
		if (!isActive) {
			grow.value = 0;
			return;
		}
		grow.value = reduceMotion
			? 1
			: withDelay(delay, withTiming(1, { duration: GROW_MS, easing: GROW_EASE }));
	}, [isActive, reduceMotion, delay, grow]);
	return grow;
};
