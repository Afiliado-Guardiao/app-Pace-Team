import { useCallback, useEffect, useRef, useState } from "react";

import * as SplashScreen from "expo-splash-screen";

import {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withTiming,
} from "react-native-reanimated";

import { useStore } from "@/store";

interface IUseBootSplashReturn {
	isVisible: boolean;
	screenStyle: ReturnType<typeof useAnimatedStyle>;
	logoStyle: ReturnType<typeof useAnimatedStyle>;
	handleImageReady: () => void;
}

// Só a foto, depois o logo, um instante parado e some
const TIMES = { photo: 450, logo: 700, hold: 650, fade: 350 } as const;
// Se a foto não avisar que carregou, segue assim mesmo
const IMAGE_WAIT_MAX = 1200;
const LOGO_OFFSET = -24;
const LOGO_SKEW = -8;

// Abertura curta de quem já tem o app: a foto (igual à da tela nativa) fica
// na frente enquanto o Início carrega por trás, e o logo entra depois dela.
export const useBootSplash = (): IUseBootSplashReturn => {
	const hasApp = useStore((s) => s.isAuthenticated || s.isCompleted);
	const [isVisible, setIsVisible] = useState(hasApp);
	const started = useRef(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const logo = useSharedValue(0);
	const screen = useSharedValue(1);

	const handleImageReady = useCallback(() => {
		if (started.current) return;
		started.current = true;
		void SplashScreen.hideAsync();
		const fadeAt = TIMES.photo + TIMES.logo + TIMES.hold;
		logo.value = withDelay(
			TIMES.photo,
			withTiming(1, { duration: TIMES.logo, easing: Easing.out(Easing.cubic) }),
		);
		screen.value = withDelay(fadeAt, withTiming(0, { duration: TIMES.fade }));
		timer.current = setTimeout(() => {
			setIsVisible(false);
		}, fadeAt + TIMES.fade);
	}, [logo, screen]);

	useEffect(() => {
		if (!isVisible) return undefined;
		const fallback = setTimeout(handleImageReady, IMAGE_WAIT_MAX);
		return () => {
			clearTimeout(fallback);
		};
	}, [isVisible, handleImageReady]);

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
		},
		[],
	);

	const screenStyle = useAnimatedStyle(() => ({ opacity: screen.value }));
	const logoStyle = useAnimatedStyle(() => ({
		opacity: logo.value,
		transform: [
			{ translateX: (1 - logo.value) * LOGO_OFFSET },
			{ skewX: `${String((1 - logo.value) * LOGO_SKEW)}deg` },
		],
	}));

	return { isVisible, screenStyle, logoStyle, handleImageReady };
};
