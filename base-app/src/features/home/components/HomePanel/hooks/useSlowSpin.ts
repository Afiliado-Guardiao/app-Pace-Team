import { useEffect } from "react";

import {
	cancelAnimation,
	Easing,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";

const TURN_MS = 24000;

// Roleta da seção girando devagar (só com a seção na frente)
export const useSlowSpin = (isActive: boolean): ReturnType<typeof useAnimatedStyle> => {
	const reduceMotion = useReducedMotion();
	const deg = useSharedValue(0);
	useEffect(() => {
		if (!isActive || reduceMotion) {
			cancelAnimation(deg);
			return undefined;
		}
		deg.value = withRepeat(
			withTiming(deg.value + 360, { duration: TURN_MS, easing: Easing.linear }),
			-1,
		);
		return () => {
			cancelAnimation(deg);
		};
	}, [isActive, reduceMotion, deg]);
	return useAnimatedStyle(() => ({ transform: [{ rotate: `${String(deg.value)}deg` }] }));
};
