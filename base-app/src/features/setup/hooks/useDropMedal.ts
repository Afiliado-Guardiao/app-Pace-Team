import { useEffect } from "react";

import * as Haptics from "expo-haptics";

import { useAnimatedStyle, useSharedValue, withDelay, withSpring } from "react-native-reanimated";

// 08 · a medalha cai do alto girando (translateY −120 → 0, −18° → 0,
// escala .6 → 1) com mola e, ao pousar, uma vibração
export const useDropMedal = () => {
	const t = useSharedValue(0);

	useEffect(() => {
		t.value = withDelay(300, withSpring(1, { damping: 10, stiffness: 120 }));
		const timer = setTimeout(() => {
			void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
		}, 750);
		return () => {
			clearTimeout(timer);
		};
	}, [t]);

	return useAnimatedStyle(() => ({
		opacity: Math.min(1, t.value * 2),
		transform: [
			{ translateY: (1 - t.value) * -120 },
			{ rotate: `${String((1 - t.value) * -18)}deg` },
			{ scale: 0.6 + 0.4 * t.value },
		],
	}));
};
