import { useEffect } from "react";

import {
	cancelAnimation,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/theme";

interface IUseAnimatedContentReturn {
	animatedStyle: {
		opacity: number;
		transform: Array<{ translateY: number }>;
	};
}

export const useAnimatedContent = (triggerKey?: string): IUseAnimatedContentReturn => {
	const { theme } = useTheme();
	const slideDistance = 20;

	const opacity = useSharedValue(0);
	const translateY = useSharedValue(slideDistance);

	useEffect(() => {
		cancelAnimation(opacity);
		cancelAnimation(translateY);

		const config = {
			duration: theme.animations.durations.normal,
			easing: theme.animations.easings.inOut,
		};

		opacity.value = withTiming(1, config);
		translateY.value = withTiming(0, config);

		return () => {
			cancelAnimation(opacity);
			cancelAnimation(translateY);
		};
	}, [triggerKey, opacity, translateY, theme, slideDistance]);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
		transform: [{ translateY: translateY.value }],
	}));

	return { animatedStyle };
};
