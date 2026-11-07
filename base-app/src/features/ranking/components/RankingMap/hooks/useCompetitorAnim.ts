import { useEffect } from "react";

import {
	Easing,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withDelay,
	withRepeat,
	withSpring,
	withTiming,
} from "react-native-reanimated";

const POP_BASE = 300;
const POP_STEP = 90;
const STRIDE_MS = 420;
const WAVE_MS = 2800;

// Competidor do mapa: surge com um pop (a partir da sua equipe), corre no
// lugar e a bandeira tremula (cada uma no seu tempo)
export const useCompetitorAnim = (o: { rank: number; myRank: number; replay: string }) => {
	const pop = useSharedValue(0);
	const step = useSharedValue(0);
	const wave = useSharedValue(0);
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		if (reduceMotion) {
			pop.value = 1;
			return;
		}
		pop.value = 0;
		pop.value = withDelay(
			POP_BASE + Math.abs(o.rank - o.myRank) * POP_STEP,
			withSpring(1, { damping: 12, stiffness: 140 }),
		);
		step.value = withRepeat(
			withTiming(1, { duration: STRIDE_MS, easing: Easing.inOut(Easing.quad) }),
			-1,
			true,
		);
		wave.value = withDelay(
			(o.rank * 370) % WAVE_MS,
			withRepeat(
				withTiming(1, { duration: WAVE_MS / 2, easing: Easing.inOut(Easing.sin) }),
				-1,
				true,
			),
		);
	}, [o.rank, o.myRank, o.replay, pop, step, wave, reduceMotion]);

	const popStyle = useAnimatedStyle(() => ({
		opacity: Math.min(1, pop.value * 1.4),
		transform: [{ translateY: (1 - pop.value) * 16 }, { scale: 0.4 + 0.6 * pop.value }],
	}));
	const runStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: -3 * step.value }, { rotate: `${String(-1 + 2.5 * step.value)}deg` }],
	}));
	const flagStyle = useAnimatedStyle(() => ({
		transform: [
			{ perspective: 140 },
			{ rotateY: `${String(-16 * wave.value)}deg` },
			{ skewY: `${String(-3 * wave.value)}deg` },
		],
	}));
	return { popStyle, runStyle, flagStyle };
};
