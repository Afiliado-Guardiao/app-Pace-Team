import { useCallback } from "react";

import { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useTheme } from "@/theme";

interface IUsePressScaleReturn {
	animatedStyle: ReturnType<typeof useAnimatedStyle>;
	onPressIn: () => void;
	onPressOut: () => void;
}

// Pressionar = escala .97 (botões) / .94 (botões de ícone) / .985 (cards),
// com a transição de 140ms ease-out do design system.
export const usePressScale = (pressedScale: number, enabled = true): IUsePressScaleReturn => {
	const { theme } = useTheme();
	const { durations, easings } = theme.pace.motion;
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

	const animateTo = useCallback(
		(value: number) => {
			scale.value = withTiming(value, {
				duration: durations.fast,
				easing: Easing.bezier(...easings.out),
			});
		},
		[scale, durations.fast, easings.out],
	);

	const onPressIn = useCallback(() => {
		if (enabled) animateTo(pressedScale);
	}, [enabled, animateTo, pressedScale]);

	const onPressOut = useCallback(() => {
		animateTo(1);
	}, [animateTo]);

	return { animatedStyle, onPressIn, onPressOut };
};
