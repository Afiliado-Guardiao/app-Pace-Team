import { useEffect } from "react";

import { SkPicture } from "@shopify/react-native-skia";
import {
	Easing,
	SharedValue,
	useDerivedValue,
	useReducedMotion,
	useSharedValue,
	withDelay,
	withSequence,
	withTiming,
} from "react-native-reanimated";

import { tickArcPicture, TICKS } from "../scene/tickArc";

const MS_PER_TICK = 45;
const MIN_RISE_MS = 520;
const SETTLE_MS = 520;
const START_DELAY = 300;
// Sobe além do nível e volta (como o medidor antigo, que passava e assentava)
const OVERSHOOT_MIN = 2.5;
const OVERSHOOT_RATIO = 0.22;

const peakOf = (target: number): number =>
	Math.min(TICKS, target + Math.max(OVERSHOOT_MIN, target * OVERSHOOT_RATIO));

// Acende os tracinhos (45 ms cada) além de km / meta e assenta no nível certo.
// Ao abrir sobe do zero; depois de uma corrida sobe do valor atual.
export const useTickArc = (o: { km: number; goal: number; k: number }): SharedValue<SkPicture> => {
	const { k } = o;
	const target = TICKS * Math.min(1, o.goal > 0 ? Math.max(0, o.km) / o.goal : 0);
	const lit = useSharedValue(0);
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		if (reduceMotion) {
			lit.value = target;
			return;
		}
		const peak = peakOf(target);
		const rise = Math.max(MIN_RISE_MS, Math.abs(peak - lit.value) * MS_PER_TICK);
		lit.value = withDelay(
			START_DELAY,
			withSequence(
				withTiming(peak, { duration: rise, easing: Easing.out(Easing.cubic) }),
				withTiming(target, { duration: SETTLE_MS, easing: Easing.inOut(Easing.cubic) }),
			),
		);
	}, [lit, target, reduceMotion]);

	return useDerivedValue(() => tickArcPicture(k, lit.value));
};
