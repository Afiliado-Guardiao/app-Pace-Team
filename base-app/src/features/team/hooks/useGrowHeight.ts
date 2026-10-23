import { useEffect } from "react";

import {
	Easing,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withDelay,
	withTiming,
} from "react-native-reanimated";

const DURATION = 900;
// Mola do pódio (cubic-bezier(.34,1.45,.64,1) do design)
const EASING = Easing.bezier(0.34, 1.45, 0.64, 1);

// Altura que sobe do zero com mola; recomeça quando `key` muda (troca de métrica).
export const useGrowHeight = (
	height: number,
	delay: number,
	key: string,
): ReturnType<typeof useAnimatedStyle> => {
	const reduceMotion = useReducedMotion();
	const value = useSharedValue(reduceMotion ? height : 0);

	useEffect(() => {
		if (reduceMotion) {
			value.value = height;
			return;
		}
		value.value = 0;
		value.value = withDelay(delay, withTiming(height, { duration: DURATION, easing: EASING }));
	}, [height, delay, key, reduceMotion, value]);

	return useAnimatedStyle(() => ({ height: value.value }));
};
