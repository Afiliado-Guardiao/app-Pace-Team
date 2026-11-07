import { useCallback, useEffect, useRef } from "react";

import Animated, {
	cancelAnimation,
	Easing,
	scrollTo,
	useAnimatedReaction,
	useAnimatedRef,
	useReducedMotion,
	useScrollViewOffset,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

const OPEN_DELAY = 500;
const OPEN_MS = 1400;
const SELECT_MS = 650;

// Rola o mapa com animação suave (ease-out cúbico). Qualquer toque do atleta
// cancela o deslize em andamento.
export const useMapScroll = (o: { maxY: number; viewport: number }) => {
	const ref = useAnimatedRef<Animated.ScrollView>();
	const offset = useScrollViewOffset(ref);
	const driver = useSharedValue(-1);
	const reduceMotion = useReducedMotion();
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useAnimatedReaction(
		() => driver.value,
		(v) => {
			if (v >= 0) scrollTo(ref, 0, v, false);
		},
	);

	const clampY = useCallback((y: number) => Math.max(0, Math.min(o.maxY, y)), [o.maxY]);

	const glide = useCallback(
		(toY: number, duration: number) => {
			cancelAnimation(driver);
			const target = clampY(toY);
			if (reduceMotion) {
				driver.value = target;
				return;
			}
			driver.value = offset.value;
			driver.value = withTiming(target, { duration, easing: Easing.out(Easing.cubic) });
		},
		[driver, offset, clampY, reduceMotion],
	);

	// Centraliza um ponto do mapa na tela
	const centerOn = useCallback(
		(y: number, duration = SELECT_MS) => { glide(y - o.viewport / 2, duration); },
		[glide, o.viewport],
	);

	// Abre no cume e, depois de meio segundo, desliza até a sua equipe
	const openAt = useCallback(
		(y: number) => {
			if (timer.current) clearTimeout(timer.current);
			cancelAnimation(driver);
			driver.value = 0;
			timer.current = setTimeout(() => { centerOn(y, OPEN_MS); }, OPEN_DELAY);
		},
		[centerOn, driver],
	);

	const stop = useCallback(() => {
		if (timer.current) clearTimeout(timer.current);
		cancelAnimation(driver);
		driver.value = -1;
	}, [driver]);

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
		},
		[],
	);

	return { ref, centerOn, glide, openAt, stop };
};
