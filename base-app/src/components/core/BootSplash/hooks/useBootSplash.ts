import { useCallback, useEffect, useRef, useState } from "react";

import * as SplashScreen from "expo-splash-screen";

import { useIsFetching } from "@tanstack/react-query";
import { useReducedMotion } from "react-native-reanimated";

import { useStore } from "@/store";

import { markSplashDone } from "../splashState";

import { useSplashBuddy } from "./useSplashBuddy";
import { SPLASH_T, useSplashTimeline } from "./useSplashTimeline";

// Com "Reduzir movimento": só o logo parado, um instante
const STILL_MS = 1100;

// Abertura de quem já tem o app: logo no azul do app e o Bud chegando
// correndo, vestindo acessórios enquanto o Início carrega por trás. Sem
// tempo fixo: com o app pronto (nada mais carregando) e pelo menos um
// acessório no Bud, ele sai correndo e o Início aparece. Tocar pula.
export const useBootSplash = () => {
	const hasApp = useStore((s) => s.isAuthenticated || s.isCompleted);
	const [isVisible, setIsVisible] = useState(hasApp);
	const reduceMotion = useReducedMotion();
	const timeline = useSplashTimeline();
	const buddy = useSplashBuddy();
	const fetching = useRef(0);
	fetching.current = useIsFetching();
	const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
	const started = useRef(false);
	const leaving = useRef(false);
	const startedAt = useRef(0);

	const clearTimers = useCallback(() => {
		timers.current.forEach(clearTimeout);
		timers.current = [];
	}, []);

	const finish = useCallback(() => {
		clearTimers();
		setIsVisible(false);
		markSplashDone();
	}, [clearTimers]);

	const later = useCallback((fn: () => void, ms: number) => {
		timers.current.push(setTimeout(fn, ms));
	}, []);

	// A cada acessório: se o app já está pronto, sai; senão cai o próximo
	const tick = useCallback(() => {
		if (leaving.current) return;
		const isReady = fetching.current === 0 && buddy.drops.current >= 1;
		const isLate = Date.now() - startedAt.current > SPLASH_T.maxMs;
		if (isReady || isLate) {
			leaving.current = true;
			buddy.run();
			timeline.leave(finish);
			return;
		}
		buddy.dropNext();
		later(tick, SPLASH_T.dropEvery);
	}, [buddy, timeline, finish, later]);

	useEffect(() => {
		if (!hasApp) markSplashDone();
	}, [hasApp]);

	useEffect(() => {
		if (!isVisible || started.current) return;
		started.current = true;
		startedAt.current = Date.now();
		void SplashScreen.hideAsync();
		if (reduceMotion) {
			timeline.showAll();
			later(finish, STILL_MS);
			return;
		}
		timeline.play();
		later(buddy.stand, SPLASH_T.runIn + SPLASH_T.runInMs);
		later(tick, SPLASH_T.firstDrop);
	}, [isVisible, reduceMotion, timeline, buddy.stand, tick, finish, later]);

	useEffect(() => clearTimers, [clearTimers]);

	return {
		isVisible,
		isStill: reduceMotion,
		styles: timeline.styles,
		buddy,
		skip: finish,
	};
};
