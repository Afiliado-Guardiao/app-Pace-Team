import { useEffect } from "react";

import {
	cancelAnimation,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/theme";

interface IUseAnimatedStepContainerReturn {
	animatedStyle: {
		opacity: number;
		transform: Array<{ translateX: number }>;
	};
}

export const useAnimatedStepContainer = (
	direction: "forward" | "backward",
	stepIndex?: number,
): IUseAnimatedStepContainerReturn => {
	const { theme } = useTheme();
	const slideDistance = 40;

	const opacity = useSharedValue(0);
	const translateX = useSharedValue(direction === "forward" ? slideDistance : -slideDistance);

	useEffect(() => {
		const initialX = direction === "forward" ? slideDistance : -slideDistance;
		opacity.value = 0;
		translateX.value = initialX;

		cancelAnimation(opacity);
		cancelAnimation(translateX);

		const config = {
			duration: theme.animations.durations.normal,
			easing: theme.animations.easings.inOut,
		};

		opacity.value = withTiming(1, config);
		translateX.value = withTiming(0, config);

		return () => {
			cancelAnimation(opacity);
			cancelAnimation(translateX);
		};
	}, [direction, stepIndex, opacity, translateX, theme, slideDistance]);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
		transform: [{ translateX: translateX.value }],
	}));

	return { animatedStyle };
};
