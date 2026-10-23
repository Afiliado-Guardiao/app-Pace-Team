import { useEffect } from "react";

import {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withSequence,
	withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/theme";

import { STACK, STACK_POSES } from "../constants";

import { IStackPhase } from "./useHomeStack";

type IPose = (typeof STACK_POSES)[keyof typeof STACK_POSES];

const poseFor = (isFront: boolean, phase: IStackPhase): IPose => {
	if (isFront) return phase === "out" ? STACK_POSES.frontOut : STACK_POSES.frontIdle;
	return phase === "in" ? STACK_POSES.backIn : STACK_POSES.backIdle;
};

// Tremor do card da virada nova (pt-shake): balança e assenta em 0,9 s
const SHAKE = [-3, 3, -3, 3, -2, 2, -1, 1, 0];

// Pose inclinada de cada card da pilha, com a mola do protótipo (.42 s).
export const useStackCardStyle = (
	isFront: boolean,
	phase: IStackPhase,
	shakeKey: number,
): ReturnType<typeof useAnimatedStyle> => {
	const { theme } = useTheme();
	const target = poseFor(isFront, phase);
	const x = useSharedValue(target.x);
	const y = useSharedValue(target.y);
	const rotate = useSharedValue(target.rotate);
	const scale = useSharedValue(target.scale);
	const shake = useSharedValue(0);
	const easing = Easing.bezier(...theme.pace.motion.easings.rail);

	useEffect(() => {
		const config = { duration: STACK.poseMs, easing };
		x.value = withTiming(target.x, config);
		y.value = withTiming(target.y, config);
		rotate.value = withTiming(target.rotate, config);
		scale.value = withTiming(target.scale, config);
	}, [target, x, y, rotate, scale, easing]);

	useEffect(() => {
		if (shakeKey === 0) return;
		const step = STACK.shakeMs / SHAKE.length;
		shake.value = withSequence(...SHAKE.map((deg) => withTiming(deg, { duration: step })));
	}, [shakeKey, shake]);

	return useAnimatedStyle(() => ({
		zIndex: isFront ? 2 : 1,
		transform: [
			{ translateX: x.value + shake.value * 1.3 },
			{ translateY: y.value },
			{ rotate: `${String(rotate.value + shake.value)}deg` },
			{ scale: scale.value },
		],
	}));
};
