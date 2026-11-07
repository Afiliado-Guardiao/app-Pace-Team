import { useEffect } from "react";

import { SkPicture } from "@shopify/react-native-skia";
import {
	cancelAnimation,
	Easing,
	SharedValue,
	useDerivedValue,
	useReducedMotion,
	useSharedValue,
	withDelay,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";

import { tickArcPicture, TICKS } from "../scene/tickArc";

const START_DELAY = 300;
// Como o painel de um carro ligando: varre o arco inteiro e desce até o nível
const SWEEP_UP_MS = 750;
const SETTLE_MS = 850;
// Depois de uma corrida: sobe um pouco além do valor novo e assenta
const OVERSHOOT_MIN = 2.5;
const OVERSHOOT_RATIO = 0.22;
const RISE_MS = 700;
// Brilho que corre pelos tracinhos a cada ~10 s (o valor não muda)
const SHINE_EVERY_MS = 9000;
const SHINE_MS = 1100;

interface IUseTickArcReturn {
	arc: SharedValue<SkPicture>;
	// 0..1 enquanto o brilho corre (o número dá uma pulsadinha junto)
	shine: SharedValue<number>;
}

// Medidor de tracinhos: ao abrir (e ao voltar para o Início, `replay`) varre
// até o fim e assenta em km / meta; com km novo sobe até o valor novo.
export const useTickArc = (o: {
	km: number;
	goal: number;
	k: number;
	replay: number;
}): IUseTickArcReturn => {
	const { k, replay } = o;
	const target = TICKS * Math.min(1, o.goal > 0 ? Math.max(0, o.km) / o.goal : 0);
	const lit = useSharedValue(0);
	const shine = useSharedValue(0);
	const reduceMotion = useReducedMotion();

	// Abrir / voltar: varredura completa
	useEffect(() => {
		if (reduceMotion) return;
		lit.value = 0;
		lit.value = withDelay(
			START_DELAY,
			withSequence(
				withTiming(TICKS, { duration: SWEEP_UP_MS, easing: Easing.out(Easing.cubic) }),
				withTiming(target, { duration: SETTLE_MS, easing: Easing.inOut(Easing.cubic) }),
			),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps -- só ao abrir/voltar
	}, [replay, reduceMotion]);

	// Valor novo (depois de uma corrida): sobe além e assenta
	useEffect(() => {
		if (reduceMotion) {
			lit.value = target;
			return;
		}
		if (lit.value === 0) return;
		const peak = Math.min(TICKS, target + Math.max(OVERSHOOT_MIN, target * OVERSHOOT_RATIO));
		lit.value = withSequence(
			withTiming(peak, { duration: RISE_MS, easing: Easing.out(Easing.cubic) }),
			withTiming(target, { duration: SETTLE_MS, easing: Easing.inOut(Easing.cubic) }),
		);
	}, [lit, target, reduceMotion]);

	// Brilho periódico
	useEffect(() => {
		if (reduceMotion) return;
		shine.value = withRepeat(
			withSequence(
				withDelay(
					SHINE_EVERY_MS,
					withTiming(1, { duration: SHINE_MS, easing: Easing.inOut(Easing.quad) }),
				),
				withTiming(0, { duration: 0 }),
			),
			-1,
		);
		return () => {
			cancelAnimation(shine);
		};
	}, [shine, reduceMotion]);

	const arc = useDerivedValue(() =>
		tickArcPicture(k, reduceMotion ? target : lit.value, shine.value),
	);
	return { arc, shine };
};
