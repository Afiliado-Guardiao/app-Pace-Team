import { useEffect, useState } from "react";

import * as Haptics from "expo-haptics";

import {
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withSpring,
	withTiming,
} from "react-native-reanimated";

import { SETUP_COPY } from "../constants";

const START = 0.35;
const BAR_MS = 1100;

// Medalha entra com mola; a barra de nível vai de 35% a 100% em 1,1 s e o
// rótulo muda de "Nível 1" para "Nível 2 ↑"
export const useMedalOverlay = (open: boolean) => {
	const pop = useSharedValue(0);
	const bar = useSharedValue(START);
	const spin = useSharedValue(0);
	const [isUp, setIsUp] = useState(false);

	useEffect(() => {
		if (!open) return undefined;
		pop.value = 0;
		bar.value = START;
		setIsUp(false);
		pop.value = withSpring(1, { damping: 9, stiffness: 160 });
		bar.value = withDelay(500, withTiming(1, { duration: BAR_MS }));
		spin.value = 0;
		spin.value = withRepeat(withTiming(1, { duration: 12000 }), -1);
		void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
		const timer = setTimeout(() => {
			setIsUp(true);
		}, 500 + BAR_MS);
		return () => {
			clearTimeout(timer);
		};
	}, [open, pop, bar, spin]);

	return {
		levelText: isUp ? SETUP_COPY.medalLevelB : SETUP_COPY.medalLevelA,
		medal: useAnimatedStyle(() => ({
			opacity: Math.min(1, pop.value * 1.5),
			transform: [
				{ scale: 0.4 + 0.6 * pop.value },
				{ rotate: `${String((1 - pop.value) * -18)}deg` },
			],
		})),
		spin: useAnimatedStyle(() => ({ transform: [{ rotate: `${String(spin.value * 360)}deg` }] })),
		bar: useAnimatedStyle(() => ({
			width: `${String(Math.round(bar.value * 100))}%` as `${number}%`,
		})),
	};
};
