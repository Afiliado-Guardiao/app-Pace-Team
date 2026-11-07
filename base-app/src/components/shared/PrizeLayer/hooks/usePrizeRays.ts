import { useEffect } from "react";

import {
	Easing,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";

const TURN_MS = 24000;

// Giro lento dos raios (parado com "Reduzir movimento")
export const usePrizeRays = (): ReturnType<typeof useAnimatedStyle> => {
	const turn = useSharedValue(0);
	const reduceMotion = useReducedMotion();
	useEffect(() => {
		if (reduceMotion) return;
		turn.value = withRepeat(withTiming(360, { duration: TURN_MS, easing: Easing.linear }), -1);
	}, [turn, reduceMotion]);
	return useAnimatedStyle(() => ({ transform: [{ rotate: `${String(turn.value)}deg` }] }));
};
