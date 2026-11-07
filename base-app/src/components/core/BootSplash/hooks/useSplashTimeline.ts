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

// Linha do tempo da abertura (ms), igual à prévia aprovada pelo Wesley
export const SPLASH_T = {
	glow: 100,
	streak: 120,
	symbol: 300,
	pace: 850,
	team: 1100,
	tag: 1500,
	buddyIn: 1900,
	bubble: 2550,
	buddyOut: 3700,
	out: 4400,
	end: 4950,
} as const;

// Buddy espiando (pés cortados pela borda de baixo)
export const SPLASH_BUDDY = { width: 168, height: 214, bottom: -62 } as const;

const ease = Easing.out(Easing.cubic);
const t = (v: SharedValue<number>, at: number, duration: number) => {
	v.value = withDelay(at, withTiming(1, { duration, easing: ease }));
};

// Valores 0..1 de cada peça e os estilos animados da abertura
export const useSplashTimeline = () => {
	const glow = useSharedValue(0);
	const streak = useSharedValue(0);
	const symbol = useSharedValue(0);
	const pace = useSharedValue(0);
	const team = useSharedValue(0);
	const tag = useSharedValue(0);
	const buddy = useSharedValue(0);
	const bubble = useSharedValue(0);
	const out = useSharedValue(0);

	const play = useCallback(() => {
		t(glow, SPLASH_T.glow, 1500);
		t(streak, SPLASH_T.streak, 550);
		symbol.value = withDelay(SPLASH_T.symbol, withSpring(1, { damping: 11, stiffness: 130 }));
		t(pace, SPLASH_T.pace, 550);
		t(team, SPLASH_T.team, 550);
		t(tag, SPLASH_T.tag, 600);
		buddy.value = withDelay(
			SPLASH_T.buddyIn,
			withSequence(
				withTiming(1, { duration: 480, easing: ease }),
				withDelay(
					SPLASH_T.buddyOut - SPLASH_T.buddyIn - 480,
					withTiming(0, { duration: 560, easing: Easing.in(Easing.cubic) }),
				),
			),
		);
		bubble.value = withDelay(
			SPLASH_T.bubble,
			withSequence(
				withSpring(1, { damping: 10 }),
				withDelay(900, withTiming(0, { duration: 260 })),
			),
		);
		t(out, SPLASH_T.out, SPLASH_T.end - SPLASH_T.out);
	}, [glow, streak, symbol, pace, team, tag, buddy, bubble, out]);

	const showAll = useCallback(() => {
		[glow, symbol, pace, team, tag].forEach((v) => {
			v.value = 1;
		});
	}, [glow, symbol, pace, team, tag]);

	const styles = {
		glow: useAnimatedStyle(() => ({
			opacity: glow.value,
			transform: [{ scale: 0.4 + 0.6 * glow.value }],
		})),
		streak: useAnimatedStyle(() => ({
			opacity: streak.value < 0.4 ? streak.value * 2.5 : (1 - streak.value) * 1.66,
			transform: [{ rotate: "-32deg" }, { scaleX: streak.value }],
		})),
		symbol: useAnimatedStyle(() => ({
			opacity: Math.min(1, symbol.value * 1.6),
			transform: [
				{ translateX: (1 - symbol.value) * -30 },
				{ translateY: (1 - symbol.value) * 26 },
				{ rotate: `${String((1 - symbol.value) * -10)}deg` },
				{ scale: 0.85 + 0.15 * symbol.value },
			],
		})),
		paceClip: useAnimatedStyle(() => ({ width: 150 * pace.value })),
		team: useAnimatedStyle(() => ({
			opacity: team.value,
			transform: [{ translateY: (1 - team.value) * 10 }, { scaleX: 1.35 - 0.35 * team.value }],
		})),
		tag: useAnimatedStyle(() => ({
			opacity: tag.value * (1 - out.value),
			transform: [{ translateY: (1 - tag.value) * 8 }],
		})),
		logo: useAnimatedStyle(() => ({
			opacity: 1 - out.value,
			transform: [{ scale: 1 + 0.12 * out.value }],
		})),
		// Sai da lateral: 105% da largura dele escondido → 34% (aparece cabeça e mão)
		buddy: useAnimatedStyle(() => ({
			transform: [{ translateX: (1.05 - 0.71 * buddy.value) * SPLASH_BUDDY.width }],
		})),
		bubble: useAnimatedStyle(() => ({
			opacity: Math.min(1, bubble.value),
			transform: [{ scale: 0.5 + 0.5 * bubble.value }],
		})),
		screen: useAnimatedStyle(() => ({
			opacity: out.value > 0.55 ? 1 - (out.value - 0.55) / 0.45 : 1,
		})),
	};

	return { play, showAll, styles };
};
