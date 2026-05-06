import * as Haptics from "expo-haptics";

import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useTheme } from "@/theme";

interface IUsePressAnimationReturn {
	animatedStyle: {
		transform: Array<{ scale: number }>;
	};
	handlePressIn: () => void;
	handlePressOut: () => void;
}

export const usePressAnimation = (): IUsePressAnimationReturn => {
	const { theme } = useTheme();
	const scale = useSharedValue(1);

	const handlePressIn = () => {
		scale.value = withTiming(0.97, {
			duration: theme.animations.durations.fast,
			easing: theme.animations.easings.inOut,
		});
		void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
	};

	const handlePressOut = () => {
		scale.value = withTiming(1, {
			duration: theme.animations.durations.fast,
			easing: theme.animations.easings.inOut,
		});
	};

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	return {
		animatedStyle,
		handlePressIn,
		handlePressOut,
	};
};
