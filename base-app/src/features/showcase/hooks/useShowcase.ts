import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";

import { useRouter } from "expo-router";

import { IBuddyPose } from "@/components/buddy";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { COLLAGE_H } from "../constants";

const IDLE: IBuddyPose = { act: "idle", phase: null, blink: false, gx: 0, gy: 0 };
const WAVE: IBuddyPose = { ...IDLE, act: "wave" };
const WAVE_MS = 1800;
const REST_MS = 3200;
const BLINK_MS = 140;
const BLINK_EVERY = 3100;

// 01 · boas-vindas do onboarding: colagem de fotos, o Buddy acenando e
// piscando, "Cada corrida. Cada km. Juntos." e Começar
export const useShowcase = () => {
	const router = useRouter();
	const { width } = useWindowDimensions();
	const [isWaving, setIsWaving] = useState(true);
	const [isBlink, setIsBlink] = useState(false);

	useEffect(() => {
		let wave: ReturnType<typeof setTimeout>;
		const cycle = (on: boolean) => {
			setIsWaving(on);
			wave = setTimeout(
				() => {
					cycle(!on);
				},
				on ? WAVE_MS : REST_MS,
			);
		};
		cycle(true);
		const blink = setInterval(() => {
			setIsBlink(true);
			setTimeout(() => {
				setIsBlink(false);
			}, BLINK_MS);
		}, BLINK_EVERY);
		return () => {
			clearTimeout(wave);
			clearInterval(blink);
		};
	}, []);

	// A colagem foi desenhada para 390 de largura; escala para a tela
	const k = Math.min(1.15, width / 390);

	return {
		k,
		collageH: COLLAGE_H * k,
		pose: { ...(isWaving ? WAVE : IDLE), blink: isBlink },
		start: () => {
			// Prévia por link: cada visita refaz o onboarding desde o começo
			if (IS_PREVIEW) {
				const { setAnswer } = useStore.getState();
				["setupSolo", "setupTeamName", "setupWantsPro", "setupDone"].forEach((key) => {
					setAnswer(key, "");
				});
				router.replace({ pathname: ROUTES.SETUP, params: { step: "profile" } });
				return;
			}
			router.replace(ROUTES.SETUP);
		},
		login: () => {
			router.push(ROUTES.WELCOME);
		},
	};
};
