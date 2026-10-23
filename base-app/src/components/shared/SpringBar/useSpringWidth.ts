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

// Largura que enche com a mola do design system (barras da disputa).
export const useSpringWidth = (
	fraction: number,
	delay: number,
): ReturnType<typeof useAnimatedStyle> => {
	const { theme } = useTheme();
	const { motion } = theme.pace;
	const reduceMotion = useReducedMotion();
	const width = useSharedValue(reduceMotion ? fraction : 0);

	useEffect(() => {
		if (reduceMotion) {
			width.value = fraction;
			return;
		}
		width.value = withDelay(
			delay,
			withTiming(fraction, {
				duration: motion.durations.progress,
				easing: Easing.bezier(...motion.easings.spring),
			}),
		);
	}, [fraction, delay, reduceMotion, width, motion]);

	return useAnimatedStyle(() => ({
		width: `${String(Math.max(0, width.value * 100))}%` as `${number}%`,
	}));
};
