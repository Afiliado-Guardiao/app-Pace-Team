import { useEffect } from "react";

import { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useTheme } from "@/theme";

import { SLIDE_FADE } from "../constants";

// Troca de foto com fade de 0,6 s (opacity transition do protótipo).
export const useSlideFade = (isVisible: boolean): ReturnType<typeof useAnimatedStyle> => {
	const { theme } = useTheme();
	const easing = theme.pace.motion.easings.out;
	const opacity = useSharedValue(isVisible ? 1 : 0);

	useEffect(() => {
		opacity.value = withTiming(isVisible ? 1 : 0, {
			duration: SLIDE_FADE,
			easing: Easing.bezier(...easing),
		});
	}, [isVisible, opacity, easing]);

	return useAnimatedStyle(() => ({ opacity: opacity.value }));
};
