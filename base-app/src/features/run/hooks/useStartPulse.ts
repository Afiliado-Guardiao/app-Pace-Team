import { useEffect } from "react";

import {
	Easing,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";

const PERIOD = 1100;

// Anel de brilho que "respira" em volta do INICIAR (pt-start-btn, 2,2 s ida e volta).
export const useStartPulse = (): ReturnType<typeof useAnimatedStyle> => {
	const reduceMotion = useReducedMotion();
	const t = useSharedValue(0);

	useEffect(() => {
		if (reduceMotion) return;
		t.value = withRepeat(
			withTiming(1, { duration: PERIOD, easing: Easing.inOut(Easing.ease) }),
			-1,
			true,
		);
	}, [reduceMotion, t]);

	return useAnimatedStyle(() => {
		const ring = 8 + 8 * t.value;
		const ringAlpha = 0.12 - 0.06 * t.value;
		const glowAlpha = 0.75 + 0.15 * t.value;
		return {
			boxShadow: `0 0 0 ${String(ring)}px rgba(253,90,12,${String(ringAlpha)}), 0 16px 44px -8px rgba(253,90,12,${String(glowAlpha)})`,
		};
	});
};
