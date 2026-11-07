import { useCallback, useEffect, useRef, useState } from "react";

import * as SplashScreen from "expo-splash-screen";

import { useReducedMotion } from "react-native-reanimated";

import { useStore } from "@/store";

import { SPLASH_T, useSplashTimeline } from "./useSplashTimeline";

// Com "Reduzir movimento": só o logo parado, um instante
const STILL_MS = 1100;

// Abertura de quem já tem o app: logo animado no azul do app e o Buddy
// espiando pela lateral ("Bora lá?"), enquanto o Início carrega por trás.
// Tocar na tela pula.
export const useBootSplash = () => {
	const hasApp = useStore((s) => s.isAuthenticated || s.isCompleted);
	const [isVisible, setIsVisible] = useState(hasApp);
	const reduceMotion = useReducedMotion();
	const timeline = useSplashTimeline();
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const started = useRef(false);

	const finish = useCallback(() => {
		if (timer.current) clearTimeout(timer.current);
		setIsVisible(false);
	}, []);

	useEffect(() => {
		if (!isVisible || started.current) return;
		started.current = true;
		void SplashScreen.hideAsync();
		if (reduceMotion) {
			timeline.showAll();
			timer.current = setTimeout(finish, STILL_MS);
			return;
		}
		timeline.play();
		timer.current = setTimeout(finish, SPLASH_T.end);
	}, [isVisible, reduceMotion, timeline, finish]);

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
		},
		[],
	);

	return { isVisible, styles: timeline.styles, skip: finish };
};
