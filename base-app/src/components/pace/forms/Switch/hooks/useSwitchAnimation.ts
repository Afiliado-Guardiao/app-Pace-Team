import { useEffect } from "react";

import {
	Easing,
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/theme";

import { THUMB_TRAVEL } from "../constants";

interface IUseSwitchAnimationReturn {
	trackStyle: ReturnType<typeof useAnimatedStyle>;
	thumbStyle: ReturnType<typeof useAnimatedStyle>;
}

// Fundo muda em 240ms e o botão desliza com a mola suave do design system.
export const useSwitchAnimation = (isOn: boolean): IUseSwitchAnimationReturn => {
	const { theme } = useTheme();
	const { colors, motion } = theme.pace;
	const progress = useSharedValue(isOn ? 1 : 0);
	const offColor = colors.glass3;
	const onColor = colors.orange[500];

	useEffect(() => {
		progress.value = withTiming(isOn ? 1 : 0, {
			duration: motion.durations.base,
			easing: Easing.bezier(...motion.easings.spring),
		});
	}, [isOn, progress, motion.durations.base, motion.easings.spring]);

	const trackStyle = useAnimatedStyle(() => ({
		backgroundColor: interpolateColor(
			Math.min(1, Math.max(0, progress.value)),
			[0, 1],
			[offColor, onColor],
		),
	}));

	const thumbStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: progress.value * THUMB_TRAVEL }],
	}));

	return { trackStyle, thumbStyle };
};
