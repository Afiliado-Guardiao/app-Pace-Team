import { useCallback } from "react";

import {
	Easing,
	SharedValue,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSequence,
	withSpring,
	withTiming,
} from "react-native-reanimated";

// Linha do tempo da abertura (ms): o logo entra na hora, o Buddy espia e,
// quando ele recolhe, o app já aparece (pedido do Wesley no build 40)
export const SPLASH_T = {
	symbol: 0,
	pace: 260,
	team: 460,
	tag: 700,
	buddyIn: 950,
	bubble: 1300,
	buddyOut: 2350,
	out: 2600,
	end: 2900,
} as const;

// Buddy espiando (pés cortados pela borda de baixo)
export const SPLASH_BUDDY = { width: 168, height: 214, bottom: -62 } as const;

const BUDDY_IN_MS = 420;
const BUDDY_OUT_MS = 380;
const BUBBLE_HOLD_MS = 650;

const ease = Easing.out(Easing.cubic);
const springy = { damping: 12, stiffness: 210, mass: 0.8 } as const;
const t = (v: SharedValue<number>, at: number, duration: number) => {
	v.value = withDelay(at, withTiming(1, { duration, easing: ease }));
};

// Valores 0..1 de cada peça e os estilos animados da abertura
export const useSplashTimeline = () => {
	const symbol = useSharedValue(0);
	const pace = useSharedValue(0);
	const team = useSharedValue(0);
	const tag = useSharedValue(0);
	const buddy = useSharedValue(0);
	const bubble = useSharedValue(0);
	const out = useSharedValue(0);

	const play = useCallback(() => {
		symbol.value = withDelay(SPLASH_T.symbol, withSpring(1, springy));
		t(pace, SPLASH_T.pace, 380);
		team.value = withDelay(SPLASH_T.team, withSpring(1, springy));
		t(tag, SPLASH_T.tag, 420);
		buddy.value = withDelay(
			SPLASH_T.buddyIn,
			withSequence(
				// Tempo fixo (mola não tem duração certa) com um passinho a mais no fim
				withTiming(1, { duration: BUDDY_IN_MS, easing: Easing.out(Easing.back(1.6)) }),
				withDelay(
					SPLASH_T.buddyOut - SPLASH_T.buddyIn - BUDDY_IN_MS,
					withTiming(0, { duration: BUDDY_OUT_MS, easing: Easing.in(Easing.cubic) }),
				),
			),
		);
		bubble.value = withDelay(
			SPLASH_T.bubble,
			withSequence(
				withSpring(1, { damping: 10, stiffness: 240 }),
				withDelay(BUBBLE_HOLD_MS, withTiming(0, { duration: 200 })),
			),
		);
		t(out, SPLASH_T.out, SPLASH_T.end - SPLASH_T.out);
	}, [symbol, pace, team, tag, buddy, bubble, out]);

	const showAll = useCallback(() => {
		[symbol, pace, team, tag].forEach((v) => {
			v.value = 1;
		});
	}, [symbol, pace, team, tag]);

	const styles = {
		symbol: useAnimatedStyle(() => ({
			opacity: Math.min(1, symbol.value * 1.8),
			transform: [
				{ translateX: (1 - symbol.value) * -36 },
				{ translateY: (1 - symbol.value) * 30 },
				{ rotate: `${String((1 - symbol.value) * -12)}deg` },
				{ scale: 0.8 + 0.2 * symbol.value },
			],
		})),
		paceClip: useAnimatedStyle(() => ({ width: 150 * pace.value })),
		team: useAnimatedStyle(() => ({
			opacity: Math.min(1, team.value),
			transform: [{ translateY: (1 - team.value) * 12 }, { scaleX: 1.35 - 0.35 * team.value }],
		})),
		tag: useAnimatedStyle(() => ({
			opacity: tag.value * (1 - out.value),
			transform: [{ translateY: (1 - tag.value) * 8 }],
		})),
		logo: useAnimatedStyle(() => ({
			opacity: 1 - out.value,
			transform: [{ scale: 1 + 0.06 * out.value }],
		})),
		// Sai da lateral: 105% da largura dele escondido → 34% (aparece cabeça e mão)
		buddy: useAnimatedStyle(() => ({
			transform: [{ translateX: (1.05 - 0.71 * buddy.value) * SPLASH_BUDDY.width }],
		})),
		bubble: useAnimatedStyle(() => ({
			opacity: Math.min(1, bubble.value),
			transform: [{ scale: 0.5 + 0.5 * bubble.value }],
		})),
		screen: useAnimatedStyle(() => ({ opacity: 1 - out.value })),
	};

	return { play, showAll, styles };
};
