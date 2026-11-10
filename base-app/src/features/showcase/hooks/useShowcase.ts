import { useEffect, useState } from "react";

import { useRouter } from "expo-router";

import {
	Easing,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withDelay,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";

import { ROUTES } from "@/constants/routes";

import { SCENES } from "../constants";

const RISE_MS = 750;
const FLOAT_MS = 3000;

// 01 · vitrine: o celular sobe na hora (já com a tela pronta) e flutua; as
// cenas trocam sozinhas, cada uma no seu tempo, em loop
export const useShowcase = () => {
	const router = useRouter();
	const isReduced = useReducedMotion();
	const [index, setIndex] = useState(0);
	const rise = useSharedValue(isReduced ? 1 : 0);
	const float = useSharedValue(0);
	const scene = SCENES[index % SCENES.length];

	useEffect(() => {
		if (isReduced) return;
		rise.value = withTiming(1, { duration: RISE_MS, easing: Easing.out(Easing.cubic) });
		float.value = withDelay(
			RISE_MS,
			withRepeat(
				withSequence(withTiming(1, { duration: FLOAT_MS }), withTiming(0, { duration: FLOAT_MS })),
				-1,
			),
		);
	}, [isReduced, rise, float]);

	useEffect(() => {
		if (isReduced) return undefined;
		const timer = setTimeout(() => {
			setIndex((n) => (n + 1) % SCENES.length);
		}, scene.ms);
		return () => {
			clearTimeout(timer);
		};
	}, [index, isReduced, scene.ms]);

	return {
		scene,
		index,
		phone: useAnimatedStyle(() => ({
			transform: [
				{ translateY: (1 - rise.value) * 240 + float.value * -10 },
				{ rotate: `${String(-10 + 7 * rise.value)}deg` },
				{ scale: 0.9 + 0.1 * rise.value },
			],
		})),
		start: () => {
			router.replace(ROUTES.ONBOARDING);
		},
		login: () => {
			router.push(ROUTES.LOGIN);
		},
	};
};
