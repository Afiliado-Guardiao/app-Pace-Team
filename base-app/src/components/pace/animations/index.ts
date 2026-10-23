// Animações de entrada do design system (tokens/base.css): pt-rise, pt-pop e
// pt-grow. Animam só opacidade e transform (nunca o layout), igual no iOS e na
// web, e respeitam "reduzir movimento" do sistema.
import { useEffect } from "react";

import {
	Easing,
	interpolate,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withDelay,
	withTiming,
} from "react-native-reanimated";

import { IPaceTheme, useTheme } from "@/theme";

type IMotion = IPaceTheme["motion"];
export type IEntranceKind = "rise" | "pop" | "grow";

interface IEntranceOptions {
	delay?: number;
	duration?: number;
	enabled?: boolean;
}

const durationOf = (motion: IMotion, kind: IEntranceKind): number =>
	({ rise: motion.durations.rise, pop: motion.durations.pop, grow: motion.durations.grow })[kind];

const easingOf = (motion: IMotion, kind: IEntranceKind) =>
	Easing.bezier(...(kind === "pop" ? motion.easings.spring : motion.easings.out));

// rise: sobe 14px e aparece · pop: cresce de 60% com overshoot · grow: cresce da base
export const useEntrance = (
	kind: IEntranceKind,
	options: IEntranceOptions = {},
): ReturnType<typeof useAnimatedStyle> => {
	const { theme } = useTheme();
	const { motion } = theme.pace;
	const { delay = 0, duration, enabled = true } = options;
	const reduceMotion = useReducedMotion();
	const isStill = !enabled || reduceMotion;
	const progress = useSharedValue(isStill ? 1 : 0);
	const offset = motion.riseOffset;

	useEffect(() => {
		if (isStill) {
			progress.value = 1;
			return;
		}
		progress.value = withDelay(
			delay,
			withTiming(1, {
				duration: duration ?? durationOf(motion, kind),
				easing: easingOf(motion, kind),
			}),
		);
	}, [isStill, delay, duration, kind, motion, progress]);

	return useAnimatedStyle(() => {
		const p = progress.value;
		if (kind === "rise") {
			return { opacity: Math.min(1, p), transform: [{ translateY: (1 - p) * offset }] };
		}
		if (kind === "pop") {
			return {
				opacity: interpolate(p, [0, 0.7], [0, 1], "clamp"),
				transform: [{ scale: interpolate(p, [0, 1], [0.6, 1]) }],
			};
		}
		return { transform: [{ scaleY: interpolate(p, [0, 0.7, 1], [0, 1.06, 1]) }] };
	});
};

// Atraso escalonado por posição (70ms por item, até o 10º)
export const staggerDelay = (motion: IMotion, position: number): number =>
	Math.min(position, motion.staggerMax) * motion.stagger;
