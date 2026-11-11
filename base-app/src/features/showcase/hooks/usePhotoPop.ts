import { useEffect } from "react";

import {
	Easing,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withDelay,
	withRepeat,
	withSequence,
	withSpring,
	withTiming,
} from "react-native-reanimated";

const STAGGER = 110;
const FLOAT_MS = 2600;

// Cada foto da colagem entra com um "pop" (uma depois da outra) e depois
// fica balançando de leve, cada uma no seu ritmo
export const usePhotoPop = (index: number, rotate: number) => {
	const isReduced = useReducedMotion();
	const pop = useSharedValue(isReduced ? 1 : 0);
	const sway = useSharedValue(0);

	useEffect(() => {
		if (isReduced) return;
		pop.value = withDelay(150 + index * STAGGER, withSpring(1, { damping: 11, stiffness: 140 }));
		sway.value = withDelay(
			900 + index * 180,
			withRepeat(
				withSequence(
					withTiming(1, { duration: FLOAT_MS + index * 120, easing: Easing.inOut(Easing.sin) }),
					withTiming(-1, { duration: FLOAT_MS + index * 120, easing: Easing.inOut(Easing.sin) }),
				),
				-1,
				true,
			),
		);
	}, [index, isReduced, pop, sway]);

	return useAnimatedStyle(() => ({
		opacity: Math.min(1, pop.value * 1.4),
		transform: [
			{ translateY: (1 - pop.value) * 40 + sway.value * 4 },
			{ rotate: `${String(rotate * pop.value + sway.value * 1.2)}deg` },
			{ scale: 0.6 + 0.4 * pop.value },
		],
	}));
};
