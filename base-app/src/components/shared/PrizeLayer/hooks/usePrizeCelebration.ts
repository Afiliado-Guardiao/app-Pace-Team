import { useEffect } from "react";
import { useWindowDimensions } from "react-native";

import {
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withDelay,
	withSpring,
	withTiming,
} from "react-native-reanimated";

import { PRIZES, usePrizeStore } from "@/lib/prizes";

import { usePrizeShare } from "./usePrizeShare";

// "Nova conquista!": a medalha entra com um pulinho, uma conquista por vez
export const usePrizeCelebration = () => {
	const current = usePrizeStore((s) => s.celebrate.at(0) ?? null);
	const next = usePrizeStore((s) => s.nextCelebration);
	const { height } = useWindowDimensions();
	const { ref, share } = usePrizeShare();
	const pop = useSharedValue(0);
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		if (!current) return;
		pop.value = 0;
		pop.value = reduceMotion ? 1 : withDelay(250, withSpring(1, { damping: 9, stiffness: 120 }));
	}, [current, pop, reduceMotion]);

	const popStyle = useAnimatedStyle(() => ({
		opacity: withTiming(pop.value > 0.05 ? 1 : 0, { duration: 120 }),
		transform: [
			{ scale: 0.3 + 0.7 * pop.value },
			{ rotate: `${String((1 - pop.value) * -14)}deg` },
		],
	}));

	return { prize: current ? PRIZES[current] : null, height, popStyle, share, ref, close: next };
};
