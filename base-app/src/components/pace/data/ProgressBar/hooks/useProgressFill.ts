import { useEffect } from "react";

import {
	Easing,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withDelay,
	withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/theme";

// Preenche de 0 até o percentual com a mola (leve overshoot) do design system.
export const useProgressFill = (
	percent: number,
	delay: number,
): ReturnType<typeof useAnimatedStyle> => {
	const { theme } = useTheme();
	const { motion } = theme.pace;
	const reduceMotion = useReducedMotion();
	const width = useSharedValue(reduceMotion ? percent : 0);

	useEffect(() => {
		if (reduceMotion) {
			width.value = percent;
			return;
		}
		width.value = withDelay(
			motion.progressDelay + delay,
			withTiming(percent, {
				duration: motion.durations.progress,
				easing: Easing.bezier(...motion.easings.spring),
			}),
		);
	}, [percent, delay, reduceMotion, width, motion]);

	return useAnimatedStyle(() => ({
		width: `${String(Math.max(0, width.value))}%` as `${number}%`,
	}));
};
