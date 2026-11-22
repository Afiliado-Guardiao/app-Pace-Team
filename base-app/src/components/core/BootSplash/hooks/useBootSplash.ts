import { useCallback, useEffect, useRef, useState } from "react";

import * as SplashScreen from "expo-splash-screen";

import { useIsFetching } from "@tanstack/react-query";
import { useReducedMotion } from "react-native-reanimated";

import { IBuddyDotsMode, IBuddyPose } from "@/components/buddy";
import { useStore } from "@/store";

import { markSplashDone } from "../splashState";

// Linha do tempo (ms): o símbolo antigo aparece e passa uns 2 segundos se
// apagando; dá lugar ao logo de hoje, que surge cinza e acende; o Bud
// chega correndo, vira as três bolinhas enquanto o app carrega e volta a ser
// o Bud quando fica pronto; aí a abertura some.
// O logo antigo fica um instante e some devagar; depois vem o novo
const OLD = { fade: 300, gone: 2000 } as const;
export const SPLASH_T = {
	fade: OLD.fade,
	logo: OLD.gone,
	bright: OLD.gone + 420,
	run: OLD.gone + 1250,
	dots: OLD.gone + 1950,
	// Mínimo de bolinhas na tela (não pisca rápido demais)
	minReady: 2700,
	back: 650,
	out: 320,
	check: 250,
	// Sem esperar mais que isso, mesmo com a internet lenta
	maxMs: 8000,
	still: 1100,
} as const;

export type ISplashPhase = "old" | "fade" | "logo" | "bright" | "run" | "dots" | "back" | "out";

const IDLE: IBuddyPose = { act: "idle", phase: null, blink: false, gx: 0, gy: 0 };
const POSES: Record<ISplashPhase, IBuddyPose> = {
	old: IDLE,
	fade: IDLE,
	logo: IDLE,
	bright: IDLE,
	run: { ...IDLE, phase: "run" },
	dots: IDLE,
	back: { ...IDLE, act: "wave" },
	out: { ...IDLE, act: "wave" },
};

// Abertura de quem já tem o app (antes do login vem o onboarding). Tocar pula.
export const useBootSplash = () => {
	const hasApp = useStore((s) => s.isAuthenticated);
	const [isVisible, setIsVisible] = useState(hasApp);
	const [phase, setPhase] = useState<ISplashPhase>("old");
	const reduceMotion = useReducedMotion();
	const fetching = useRef(0);
	fetching.current = useIsFetching();
	const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
	const started = useRef(false);
	const startedAt = useRef(0);

	const later = useCallback((fn: () => void, ms: number) => {
		timers.current.push(setTimeout(fn, ms));
	}, []);

	const finish = useCallback(() => {
		timers.current.forEach(clearTimeout);
		timers.current = [];
		setIsVisible(false);
		markSplashDone();
	}, []);

	// App pronto (nada carregando) ou tempo esgotado: o Bud volta e sai
	const check = useCallback(() => {
		const elapsed = Date.now() - startedAt.current;
		const isReady = fetching.current === 0 && elapsed >= SPLASH_T.minReady;
		if (!isReady && elapsed < SPLASH_T.maxMs) {
			later(check, SPLASH_T.check);
			return;
		}
		setPhase("back");
		later(() => {
			setPhase("out");
		}, SPLASH_T.back);
		later(finish, SPLASH_T.back + SPLASH_T.out);
	}, [later, finish]);

	useEffect(() => {
		if (!hasApp) markSplashDone();
	}, [hasApp]);

	useEffect(() => {
		if (!isVisible || started.current) return;
		started.current = true;
		startedAt.current = Date.now();
		void SplashScreen.hideAsync();
		if (reduceMotion) {
			setPhase("bright");
			later(finish, SPLASH_T.still);
			return;
		}
		later(() => {
			setPhase("fade");
		}, SPLASH_T.fade);
		later(() => {
			setPhase("logo");
		}, SPLASH_T.logo);
		later(() => {
			setPhase("bright");
		}, SPLASH_T.bright);
		later(() => {
			setPhase("run");
		}, SPLASH_T.run);
		later(() => {
			setPhase("dots");
			check();
		}, SPLASH_T.dots);
	}, [isVisible, reduceMotion, later, finish, check]);

	useEffect(
		() => () => {
			timers.current.forEach(clearTimeout);
		},
		[],
	);

	const mode: IBuddyDotsMode = phase === "dots" ? "dots" : "bud";
	return { isVisible, phase, mode, pose: POSES[phase], skip: finish };
};
