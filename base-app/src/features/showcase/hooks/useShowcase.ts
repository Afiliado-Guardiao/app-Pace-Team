import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";

import { useRouter } from "expo-router";

import { useReducedMotion } from "react-native-reanimated";

import { IBuddyPose } from "@/components/buddy";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { REF } from "../constants";

// No quadro da referência: onde acaba a última frase da arte, onde começa o
// bloco de baixo (ondinhas do Bud) e onde ele termina ("Já tenho conta")
const ART_END = 662;
const BOTTOM_START = 688;
const REF_BOTTOM = 1250;

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
			router.replace({ pathname: ROUTES.SETUP, params: { step: "boost", arrive: "1" } });
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
		const fallback = () => {
			launch(width / 2 - 95, height / 2, 190, 183);
		};
		// Nunca pode travar o Começar: sem medida, decola do meio da tela
		try {
			const node = heroRef.current as { measureInWindow?: unknown } | null;
			if (node && typeof node.measureInWindow === "function") {
				(heroRef.current as View).measureInWindow(launch);
			} else fallback();
		} catch {
			fallback();
		}
	}, [flight.stage, isReduced, goNext, width, height]);

	// Montada no quadro da referência (print do iPhone, 591 × 1280). A arte
	// de cima sempre ocupa a largura toda (a roleta e o relógio encostam nas
	// bordas, como se continuassem do lado de fora)
	const ua = width / REF.w;
	// Embaixo (Bud, frase e botões): no iPhone X em diante é a mesma escala;
	// nos de botão de início (tela mais baixa) encolhe para caber sob a arte
	const u = Math.min(ua, height / REF.h, (height - ART_END * ua) / (REF_BOTTOM - BOTTOM_START));
	const isShort = u < Math.min(ua, height / REF.h) - 0.001;

	return {
		ua,
		u,
		left: (width - REF.w * u) / 2,
		top: isShort ? height - REF_BOTTOM * u : 0,
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
