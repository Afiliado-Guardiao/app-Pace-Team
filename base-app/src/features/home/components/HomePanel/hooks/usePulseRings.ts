import { useEffect } from "react";

import {
	cancelAnimation,
	Easing,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withDelay,
	withRepeat,
	withTiming,
} from "react-native-reanimated";

const PULSE_MS = 2200;
const SECOND_MS = 1100;

type IAnimatedStyle = ReturnType<typeof useAnimatedStyle>;

// Dois anéis laranja pulsando em volta do play (escala 1 → 1.5, o segundo
// atrasado). Parados fora da seção e com "reduzir movimento"
export const usePulseRings = (isActive: boolean): [IAnimatedStyle, IAnimatedStyle] => {
	const reduceMotion = useReducedMotion();
	const a = useSharedValue(0);
	const b = useSharedValue(0);
	useEffect(() => {
		cancelAnimation(a);
		cancelAnimation(b);
		a.value = 0;
		b.value = 0;
		if (!isActive || reduceMotion) return;
		const loop = () =>
			withRepeat(withTiming(1, { duration: PULSE_MS, easing: Easing.out(Easing.quad) }), -1);
		a.value = loop();
		b.value = withDelay(SECOND_MS, loop());
	}, [isActive, reduceMotion, a, b]);
	const styleA = useAnimatedStyle(() => ({
		opacity: a.value === 0 ? 0 : 0.6 * (1 - a.value),
		transform: [{ scale: 1 + 0.5 * a.value }],
	}));
	const styleB = useAnimatedStyle(() => ({
		opacity: b.value === 0 ? 0 : 0.6 * (1 - b.value),
		transform: [{ scale: 1 + 0.5 * b.value }],
	}));
	return [styleA, styleB];
};
