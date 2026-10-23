import { useCallback, useEffect, useRef } from "react";

import { useRouter } from "expo-router";

import {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/theme";
import { ROUTES } from "@/constants/routes";

import { SPLASH_TIMING } from "../constants";

interface IUseSplashScreenReturn {
	logoStyle: ReturnType<typeof useAnimatedStyle>;
	sloganStyle: ReturnType<typeof useAnimatedStyle>;
	barStyle: ReturnType<typeof useAnimatedStyle>;
	handleSkip: () => void;
	handleVideoReady: () => void;
}

// Logo entra deslizando com inclinação, slogan sobe em seguida e a barra
// enche em 2,8 s; ao terminar (ou ao tocar) segue para a apresentação.
// Tudo começa junto com o vídeo (que pode demorar a carregar na prévia por
// link); se ele não ficar pronto a tempo, começa assim mesmo.
export const useSplashScreen = (): IUseSplashScreenReturn => {
	const router = useRouter();
	const { theme } = useTheme();
	const easeOut = Easing.bezier(...theme.pace.motion.easings.out);
	const done = useRef(false);
	const started = useRef(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const logo = useSharedValue(0);
	const slogan = useSharedValue(0);
	const bar = useSharedValue(0);

	const handleSkip = useCallback(() => {
		if (done.current) return;
		done.current = true;
		router.replace(ROUTES.ONBOARDING);
	}, [router]);

	const start = useCallback(() => {
		if (started.current) return;
		started.current = true;
		logo.value = withTiming(1, { duration: SPLASH_TIMING.logo, easing: easeOut });
		slogan.value = withDelay(
			SPLASH_TIMING.sloganDelay,
			withTiming(1, { duration: SPLASH_TIMING.slogan, easing: easeOut }),
		);
		bar.value = withTiming(1, { duration: SPLASH_TIMING.total, easing: Easing.linear });
		timer.current = setTimeout(handleSkip, SPLASH_TIMING.total);
	}, [logo, slogan, bar, easeOut, handleSkip]);

	useEffect(() => {
		const fallback = setTimeout(start, SPLASH_TIMING.videoWaitMax);
		return () => {
			clearTimeout(fallback);
			if (timer.current) clearTimeout(timer.current);
		};
	}, [start]);

	const logoStyle = useAnimatedStyle(() => ({
		opacity: Math.min(1, logo.value / 0.6),
		transform: [
			{ translateX: (1 - logo.value) * SPLASH_TIMING.logoOffset },
			{ skewX: `${String((1 - logo.value) * SPLASH_TIMING.logoSkew)}deg` },
		],
	}));
	const sloganStyle = useAnimatedStyle(() => ({
		opacity: slogan.value,
		transform: [{ translateY: (1 - slogan.value) * SPLASH_TIMING.sloganOffset }],
	}));
	const barStyle = useAnimatedStyle(() => ({ transform: [{ scaleX: bar.value }] }));

	return { logoStyle, sloganStyle, barStyle, handleSkip, handleVideoReady: start };
};
