import { useEffect } from "react";

import { SkPicture } from "@shopify/react-native-skia";
import {
	Easing,
	SharedValue,
	useDerivedValue,
	useReducedMotion,
	useSharedValue,
	withDelay,
	withTiming,
} from "react-native-reanimated";

import { tickArcPicture, TICKS } from "../scene/tickArc";

const MS_PER_TICK = 45;
const START_DELAY = 300;

// Acende os tracinhos um a um (45 ms cada) até km / meta
export const useTickArc = (o: { km: number; goal: number; k: number }): SharedValue<SkPicture> => {
	const { k } = o;
	const target = Math.round(TICKS * Math.min(1, o.goal > 0 ? o.km / o.goal : 0));
	const lit = useSharedValue(0);
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		if (reduceMotion) {
			lit.value = target;
			return;
		}
		const ticks = Math.abs(target - lit.value);
		lit.value = withDelay(
			START_DELAY,
			withTiming(target, { duration: ticks * MS_PER_TICK, easing: Easing.linear }),
		);
	}, [lit, target, reduceMotion]);

	return useDerivedValue(() => tickArcPicture(k, Math.floor(lit.value + 0.0001)));
};
