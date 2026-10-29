import { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";

import * as Haptics from "expo-haptics";

import { SharedValue } from "react-native-reanimated";

import { IBuddyAct } from "@/lib/buddy/constants";
import { useBuddyLive } from "@/lib/buddy/liveStore";

import { IBuddyPose } from "../../BuddyFigure";
import { RUNNER_H, RUNNER_W } from "../script";

interface IAliveOptions {
	x: SharedValue<number>;
	dir: 1 | -1;
	// Parado (olhando, reagindo): pode piscar e seguir o dedo com os olhos
	isStill: boolean;
	onOpen: () => void;
}

interface IUseBuddyAliveReturn {
	trackRef: React.RefObject<View | null>;
	onTrackLayout: () => void;
	// Ajusta a pose (piscar, olhar o dedo, gesto do toque)
	decorate: (pose: IBuddyPose) => IBuddyPose;
	// Toque: ele reage e depois abre "Seu Buddy"
	tap: () => void;
}

const BLINK_MS = 140;
const BLINK_EVERY = { min: 2600, extra: 2400 } as const;
// Olha o dedo só se o toque foi agora há pouco
const GAZE_FRESH_MS = 2500;
const TAP_ACTS: readonly IBuddyAct[] = ["armsUp", "wave", "impressed", "excited", "wink"];
const TAP_MS = 750;
const EVENT_MS = 1600;

const clamp = (n: number, limit: number): number => Math.max(-limit, Math.min(limit, n));

// Detalhes que deixam o Buddy vivo: pisca sozinho, olha para onde o dedo
// toca e reage quando é tocado.
export const useBuddyAlive = ({ x, dir, isStill, onOpen }: IAliveOptions): IUseBuddyAliveReturn => {
	const touch = useBuddyLive((s) => s.touch);
	const pendingAct = useBuddyLive((s) => s.pendingAct);
	const trackRef = useRef<View | null>(null);
	const trackPos = useRef({ x: 0, y: 0 });
	// Onde ele parou (lido no efeito, não durante o render)
	const stillX = useRef(0);
	const [isBlinking, setIsBlinking] = useState(false);
	const [tapAct, setTapAct] = useState<IBuddyAct | null>(null);

	useEffect(() => {
		if (!isStill) return undefined;
		stillX.current = x.value;
		let timer: ReturnType<typeof setTimeout>;
		const next = (): void => {
			timer = setTimeout(
				() => {
					setIsBlinking(true);
					timer = setTimeout(() => {
						setIsBlinking(false);
						next();
					}, BLINK_MS);
				},
				BLINK_EVERY.min + Math.random() * BLINK_EVERY.extra,
			);
		};
		next();
		return () => {
			clearTimeout(timer);
			setIsBlinking(false);
		};
	}, [isStill, x]);

	// Parado na tela quando o atleta curte/posta: reage na hora
	useEffect(() => {
		if (!isStill || !pendingAct) return undefined;
		const act = useBuddyLive.getState().takePendingAct();
		if (!act) return undefined;
		setTapAct(act);
		const timer = setTimeout(() => {
			setTapAct(null);
		}, EVENT_MS);
		return () => {
			clearTimeout(timer);
		};
	}, [isStill, pendingAct]);

	const onTrackLayout = useCallback(() => {
		trackRef.current?.measureInWindow((left, top) => {
			trackPos.current = { x: left, y: top };
		});
	}, []);

	const decorate = (pose: IBuddyPose): IBuddyPose => {
		if (tapAct) return { ...pose, act: tapAct, phase: null };
		const isFresh = touch !== null && Date.now() - touch.t < GAZE_FRESH_MS;
		if (!isStill || !isFresh) return { ...pose, blink: isBlinking };
		const centerX = trackPos.current.x + stillX.current + RUNNER_W / 2;
		const centerY = trackPos.current.y + RUNNER_H / 2;
		// O desenho espelha quando ele vai para a esquerda: o olhar também
		return {
			...pose,
			blink: isBlinking,
			gx: clamp(((touch.x - centerX) / 25) * dir, 5),
			gy: clamp((touch.y - centerY) / 40, 4),
		};
	};

	const tap = (): void => {
		if (tapAct) return;
		const act = TAP_ACTS[Math.floor(Math.random() * TAP_ACTS.length)] ?? "wave";
		setTapAct(act);
		void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setTimeout(() => {
			setTapAct(null);
			onOpen();
		}, TAP_MS);
	};

	return { trackRef, onTrackLayout, decorate, tap };
};
