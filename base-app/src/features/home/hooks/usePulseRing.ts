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

const PERIOD = 1600;
const SPREAD = 0.35;
const START_OPACITY = 0.45;

// Anel laranja que pulsa em volta da chama (pt-virada-flame).
export const usePulseRing = (isActive: boolean): ReturnType<typeof useAnimatedStyle> => {
	const reduceMotion = useReducedMotion();
	const progress = useSharedValue(0);

	useEffect(() => {
		if (!isActive || reduceMotion) {
			cancelAnimation(progress);
			progress.value = 1;
			return;
		}
		progress.value = 0;
		progress.value = withRepeat(
			withTiming(1, { duration: PERIOD, easing: Easing.inOut(Easing.ease) }),
			-1,
		);
	}, [isActive, reduceMotion, progress]);

	return useAnimatedStyle(() => ({
		opacity: START_OPACITY * (1 - progress.value),
		transform: [{ scale: 1 + SPREAD * progress.value }],
	}));
};
