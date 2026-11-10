import { useCallback } from "react";
import { useWindowDimensions } from "react-native";

import {
	Easing,
	SharedValue,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

// Linha do tempo da abertura (ms): o logo entra, o Bud chega correndo com o
// anel laranja, derrapa em cima do símbolo e começa a vestir acessórios.
// A saída (correndo para a direita) só acontece quando o app está pronto.
export const SPLASH_T = {
	symbol: 0,
	pace: 150,
	team: 300,
	tag: 450,
	runIn: 500,
	runInMs: 650,
	firstDrop: 1350,
	dropEvery: 600,
	leaveMs: 520,
	outMs: 260,
	// Sem esperar mais que isso, mesmo com a internet lenta
	maxMs: 8000,
} as const;

// Bud a 82% do tamanho do design, parado sobre o símbolo do logo
export const SPLASH_BUDDY_SCALE = 0.82;

const ease = Easing.out(Easing.cubic);
const springy = { damping: 12, stiffness: 210, mass: 0.8 } as const;
const t = (v: SharedValue<number>, at: number, duration: number) => {
	v.value = withDelay(at, withTiming(1, { duration, easing: ease }));
};

// Valores 0..1 de cada peça e os estilos animados da abertura
export const useSplashTimeline = () => {
	const { width } = useWindowDimensions();
	const symbol = useSharedValue(0);
	const pace = useSharedValue(0);
	const team = useSharedValue(0);
	const tag = useSharedValue(0);
	// 0 = fora à esquerda, 1 = parado no logo, 2 = fora à direita
	const buddyX = useSharedValue(0);
	const symbolHide = useSharedValue(0);
	const out = useSharedValue(0);

	const play = useCallback(() => {
		symbol.value = withDelay(SPLASH_T.symbol, withSpring(1, springy));
		t(pace, SPLASH_T.pace, 380);
		team.value = withDelay(SPLASH_T.team, withSpring(1, springy));
		t(tag, SPLASH_T.tag, 420);
		buddyX.value = withDelay(
			SPLASH_T.runIn,
			withTiming(1, { duration: SPLASH_T.runInMs, easing: Easing.out(Easing.back(1.1)) }),
		);
		// O Bud tampa o símbolo laranja quando derrapa em cima dele
		symbolHide.value = withDelay(
			SPLASH_T.runIn + SPLASH_T.runInMs - 160,
			withTiming(1, { duration: 200 }),
		);
	}, [symbol, pace, team, tag, buddyX, symbolHide]);

	// App pronto: o Bud sai correndo para a direita e a abertura some
	const leave = useCallback(
		(onDone: () => void) => {
			symbolHide.value = withTiming(0, { duration: 260 });
			buddyX.value = withTiming(2, { duration: SPLASH_T.leaveMs, easing: Easing.in(Easing.quad) });
			out.value = withDelay(
				SPLASH_T.leaveMs - 140,
				withTiming(1, { duration: SPLASH_T.outMs }, (finished) => {
					if (finished) scheduleOnRN(onDone);
				}),
			);
		},
		[buddyX, symbolHide, out],
	);

	const showAll = useCallback(() => {
		[symbol, pace, team, tag].forEach((v) => {
			v.value = 1;
		});
	}, [symbol, pace, team, tag]);

	const offscreen = width / 2 + 160;
	const styles = {
		symbol: useAnimatedStyle(() => ({
			opacity: Math.min(1, symbol.value * 1.8) * (1 - symbolHide.value),
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
			opacity: tag.value,
			transform: [{ translateY: (1 - tag.value) * 8 }],
		})),
		buddy: useAnimatedStyle(() => ({
			opacity: buddyX.value > 0 ? 1 : 0,
			transform: [{ translateX: (buddyX.value - 1) * offscreen }],
		})),
		screen: useAnimatedStyle(() => ({ opacity: 1 - out.value })),
	};

	return { play, leave, showAll, styles };
};
