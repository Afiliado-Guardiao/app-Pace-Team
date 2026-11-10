import { useEffect } from "react";

import {
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSequence,
	withTiming,
} from "react-native-reanimated";

const WAVE_MS = 900;
// O 2º toque vem 400 ms depois do 1º (como no design: 650 ms e 1050 ms)
const SECOND_MS = 400;

const waveStyle = (v: { value: number }) => {
	"worklet";
	return { opacity: 0.85 * (1 - v.value), transform: [{ scale: 0.5 + 1.4 * v.value }] };
};

// Ondas laranja dos 2 toques atrás do celular; recomeçam a cada batida
export const useTapWaves = (beat: number) => {
	const a = useSharedValue(1);
	const b = useSharedValue(1);

	useEffect(() => {
		a.value = withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: WAVE_MS }));
		b.value = withSequence(
			withTiming(0, { duration: 0 }),
			withDelay(SECOND_MS, withTiming(1, { duration: WAVE_MS })),
		);
	}, [beat, a, b]);

	return {
		first: useAnimatedStyle(() => waveStyle(a)),
		second: useAnimatedStyle(() => waveStyle(b)),
	};
};
