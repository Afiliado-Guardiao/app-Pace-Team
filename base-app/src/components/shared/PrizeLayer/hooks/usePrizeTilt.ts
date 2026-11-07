import { useEffect, useMemo } from "react";
import { PanResponder, PanResponderInstance } from "react-native";

import {
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withRepeat,
	withSequence,
	withSpring,
	withTiming,
} from "react-native-reanimated";

const MAX_TILT = 18;
const DRAG_FOR_MAX = 140;
const BREATH = 1.035;
const BREATH_MS = 1600;

interface IUsePrizeTiltReturn {
	pan: PanResponderInstance;
	tiltStyle: ReturnType<typeof useAnimatedStyle>;
}

// Prêmio em tela cheia: respira de leve e inclina em 3D seguindo o dedo
// (solta e volta sozinho)
export const usePrizeTilt = (): IUsePrizeTiltReturn => {
	const rx = useSharedValue(0);
	const ry = useSharedValue(0);
	const breath = useSharedValue(1);
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		if (reduceMotion) return;
		breath.value = withRepeat(
			withSequence(
				withTiming(BREATH, { duration: BREATH_MS }),
				withTiming(1, { duration: BREATH_MS }),
			),
			-1,
		);
	}, [breath, reduceMotion]);

	const pan = useMemo(
		() =>
			PanResponder.create({
				onStartShouldSetPanResponder: () => true,
				onPanResponderMove: (_, g) => {
					ry.value = Math.max(-MAX_TILT, Math.min(MAX_TILT, (g.dx / DRAG_FOR_MAX) * MAX_TILT));
					rx.value = Math.max(-MAX_TILT, Math.min(MAX_TILT, (-g.dy / DRAG_FOR_MAX) * MAX_TILT));
				},
				onPanResponderRelease: () => {
					rx.value = withSpring(0);
					ry.value = withSpring(0);
				},
			}),
		[rx, ry],
	);

	const tiltStyle = useAnimatedStyle(() => ({
		transform: [
			{ perspective: 700 },
			{ rotateX: `${String(rx.value)}deg` },
			{ rotateY: `${String(ry.value)}deg` },
			{ scale: breath.value },
		],
	}));
	return { pan, tiltStyle };
};
