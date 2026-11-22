import { useEffect } from "react";

import {
	Easing,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withRepeat,
	withSequence,
	withSpring,
	withTiming,
} from "react-native-reanimated";

const PULSE_MS = 1100;

interface IUseTrophyGlowReturn {
	popStyle: ReturnType<typeof useAnimatedStyle>;
	glowStyle: ReturnType<typeof useAnimatedStyle>;
}

// Quando a linha chega no fim: o troféu pula na tela e o brilho em volta
// fica pulsando
export const useTrophyGlow = (isReached: boolean): IUseTrophyGlowReturn => {
	const isReduced = useReducedMotion();
	const pop = useSharedValue(isReduced ? 1 : 0);
	const glow = useSharedValue(0);

	useEffect(() => {
		if (!isReached || isReduced) return;
		pop.value = withSpring(1, { damping: 9, stiffness: 170 });
		glow.value = withRepeat(
			withSequence(
				withTiming(1, { duration: PULSE_MS, easing: Easing.inOut(Easing.sin) }),
				withTiming(0, { duration: PULSE_MS, easing: Easing.inOut(Easing.sin) }),
			),
			-1,
		);
	}, [isReached, isReduced, pop, glow]);

	const popStyle = useAnimatedStyle(() => ({
		opacity: Math.min(1, pop.value * 2),
		transform: [{ scale: 0.3 + 0.7 * pop.value }],
	}));
	const glowStyle = useAnimatedStyle(() => ({
		opacity: pop.value * (0.55 + 0.45 * glow.value),
		transform: [{ scale: 1 + 0.18 * glow.value }],
	}));

	return { popStyle, glowStyle };
};
