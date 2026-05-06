import { useEffect } from "react";

import {
	cancelAnimation,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/theme";

interface IUseAnimatedOptionReturn {
	entryAnimatedStyle: {
		opacity: number;
		transform: Array<{ translateY: number }>;
	};
}

export const useAnimatedOption = (index: number): IUseAnimatedOptionReturn => {
	const { theme } = useTheme();
	const slideDistance = 20;

	const opacity = useSharedValue(0);
	const translateY = useSharedValue(slideDistance);

	useEffect(() => {
		cancelAnimation(opacity);
		cancelAnimation(translateY);

		const delay = index * 50;
		const config = {
			duration: theme.animations.durations.normal,
			easing: theme.animations.easings.inOut,
		};

		opacity.value = withDelay(delay, withTiming(1, config));
		translateY.value = withDelay(delay, withTiming(0, config));

		return () => {
			cancelAnimation(opacity);
			cancelAnimation(translateY);
		};
	}, [index, opacity, translateY, theme, slideDistance]);

	const entryAnimatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
		transform: [{ translateY: translateY.value }],
	}));

	return { entryAnimatedStyle };
};
