import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";

import { useRouter } from "expo-router";

import { useReducedMotion } from "react-native-reanimated";

import { IBuddyPose } from "@/components/buddy";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { COLLAGE_H } from "../constants";

export interface IShowcaseFlight {
	stage: "idle" | "scared" | "rocket";
	// Até onde o foguete voa (o lugar do Bud na próxima página)
	dx: number;
	dy: number;
}

const IDLE: IBuddyPose = { act: "idle", phase: null, blink: false, gx: 0, gy: 0 };
const SCARED: IBuddyPose = { ...IDLE, act: "impressed" };
const BLINK_MS = 150;
// Primeira piscada logo que ele aparece; depois de tempos em tempos
const FIRST_BLINK = 1250;
const BLINK_EVERY = 3400;
const SCARE_MS = 380;
const ROCKET_MS = 720;
// Onde o Bud conversa na página seguinte (canto de cima, à esquerda)
const LANDING = { x: 66, y: 150 } as const;

// 01 · boas-vindas do onboarding: telas do app, o Bud piscando, "Cada
// corrida. Cada km. Juntos." e Começar (o Bud se assusta e decola)
export const useShowcase = () => {
	const router = useRouter();
	const { width, height } = useWindowDimensions();
	const isReduced = useReducedMotion();
	const [isBlink, setIsBlink] = useState(false);
	const [flight, setFlight] = useState<IShowcaseFlight>({ stage: "idle", dx: 0, dy: 0 });
	const heroRef = useRef<View | null>(null);
	const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

	useEffect(() => {
		const list = timers.current;
		const blink = () => {
			setIsBlink(true);
			list.push(
				setTimeout(() => {
					setIsBlink(false);
				}, BLINK_MS),
			);
		};
		list.push(setTimeout(blink, FIRST_BLINK));
		const every = setInterval(blink, BLINK_EVERY);
		return () => {
			clearInterval(every);
			list.forEach(clearTimeout);
		};
	}, []);

	const goNext = useCallback(() => {
		// Prévia por link: cada visita refaz o onboarding desde o começo
		if (IS_PREVIEW) {
			const { setAnswer } = useStore.getState();
			["setupSolo", "setupTeamName", "setupWantsPro", "setupDone"].forEach((key) => {
				setAnswer(key, "");
			});
			router.replace({ pathname: ROUTES.SETUP, params: { step: "profile", arrive: "1" } });
			return;
		}
		router.replace({ pathname: ROUTES.SETUP, params: { arrive: "1" } });
	}, [router]);

	const start = useCallback(() => {
		if (flight.stage !== "idle") return;
		if (isReduced) {
			goNext();
			return;
		}
		const launch = (x: number, y: number, w: number, h: number) => {
			const dx = LANDING.x - (x + w / 2);
			const dy = LANDING.y - (y + h / 2);
			setFlight({ stage: "scared", dx, dy });
			timers.current.push(
				setTimeout(() => {
					setFlight({ stage: "rocket", dx, dy });
				}, SCARE_MS),
				setTimeout(goNext, SCARE_MS + ROCKET_MS),
			);
		};
		// Mede onde o Bud está agora e decola de lá
		if (heroRef.current) heroRef.current.measureInWindow(launch);
		else launch(width / 2 - 95, height / 2, 190, 183);
	}, [flight.stage, isReduced, goNext, width, height]);

	// Desenhada para 390 × 844: encolhe pela largura OU pela altura (no Safari,
	// com as barras, sobra menos altura e o botão precisa caber sempre)
	const k = Math.min(1.15, width / 390, height / 844);

	return {
		k,
		collageH: COLLAGE_H * k,
		pose: flight.stage === "idle" ? { ...IDLE, blink: isBlink } : SCARED,
		flight,
		isLeaving: flight.stage !== "idle",
		heroRef,
		start,
		login: () => {
			router.push(ROUTES.WELCOME);
		},
	};
};
