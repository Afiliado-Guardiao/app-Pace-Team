import { useCallback, useEffect, useRef, useState } from "react";
import { GestureResponderEvent, View } from "react-native";

import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

import { BUDDY_KMS, IBuddyAct } from "@/lib/buddy/constants";
import { useBuddyLive } from "@/lib/buddy/liveStore";
import { useBuddyStore } from "@/lib/buddy/store";
import { useBuddyLook } from "@/lib/buddy/useBuddyLook";
import { useMyTeam } from "@/lib/data";
import { useRunStore } from "@/lib/run";
import { ROUTES } from "@/constants/routes";

import { IBuddyPose } from "../../BuddyFigure";
import { actForGoal, speechOf, TAP_ACTS } from "../speech";

import { useBuddyIdle } from "./useBuddyIdle";

const BLINK_MS = 140;
const BLINK_EVERY = { min: 2200, extra: 2200 } as const;
// Tempo do gesto antes de sair do painel (correr, "Agora não")
const LEAVE_MS = 650;
const clamp = (n: number, limit: number): number => Math.max(-limit, Math.min(limit, n));

// Buddy vivo por cima da tela (Toque Traseiro com o app aberto): olha para
// onde o dedo está, pisca sozinho e cada toque ou botão faz um gesto.
// Sem toque, ele fica curioso, inquieto e com sono (useBuddyIdle).
export const useBuddyLivePanel = () => {
	const router = useRouter();
	const isOpen = useBuddyLive((s) => s.isPanelOpen);
	const closePanel = useBuddyLive((s) => s.closePanel);
	const look = useBuddyLook();
	const kmIdx = useBuddyStore((s) => s.kmIdx);
	const setKmIdx = useBuddyStore((s) => s.setKmIdx);
	const { team } = useMyTeam();
	const setMode = useRunStore((s) => s.setMode);
	const [act, setAct] = useState<IBuddyAct>("wave");
	const [isBlinking, setIsBlinking] = useState(false);
	const [gaze, setGaze] = useState({ gx: 0, gy: 0 });
	const figureRef = useRef<View | null>(null);
	const center = useRef({ x: 0, y: 0 });
	const taps = useRef(0);
	const km = BUDDY_KMS[kmIdx] ?? 5;
	const idle = useBuddyIdle(isOpen, setAct);

	useEffect(() => {
		if (!isOpen) return undefined;
		setAct("wave");
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
		};
	}, [isOpen]);

	const react = useCallback((next: IBuddyAct) => {
		setAct(next);
		void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	}, []);

	const leave = (next: IBuddyAct, then?: () => void): void => {
		react(next);
		setTimeout(() => {
			closePanel();
			then?.();
		}, LEAVE_MS);
	};

	const changeGoal = (delta: number): void => {
		const nextIdx = Math.max(0, Math.min(BUDDY_KMS.length - 1, kmIdx + delta));
		if (nextIdx === kmIdx) return;
		setKmIdx(nextIdx);
		react(actForGoal(BUDDY_KMS[nextIdx] ?? km, delta));
	};

	// O olhar segue o dedo em qualquer lugar do painel
	const follow = (event: GestureResponderEvent): void => {
		const { pageX, pageY } = event.nativeEvent;
		setGaze({
			gx: clamp((pageX - center.current.x) / 25, 5),
			gy: clamp((pageY - center.current.y) / 40, 4),
		});
	};

	const run = (withTeam: boolean): void => {
		leave(withTeam ? "armsUp" : "salute", () => {
			setMode(withTeam ? "team" : "free");
			router.navigate(ROUTES.RUN);
		});
	};

	return {
		isOpen,
		pose: { act, phase: null, blink: isBlinking, ...gaze } satisfies IBuddyPose,
		look,
		km,
		hasTeam: team !== null,
		speech: idle.idleSpeech ?? speechOf(km),
		figureRef,
		onFigureLayout: () => {
			figureRef.current?.measureInWindow((x, y, w, h) => {
				center.current = { x: x + w / 2, y: y + h / 2 };
			});
		},
		// Encostou no painel: ele para de cobrar (e acorda, se dormia)
		onTouchStart: (event: GestureResponderEvent) => {
			idle.bump();
			follow(event);
		},
		onTouch: follow,
		tapBuddy: () => {
			taps.current += 1;
			react(TAP_ACTS[taps.current % TAP_ACTS.length] ?? "wave");
		},
		more: () => {
			changeGoal(1);
		},
		less: () => {
			changeGoal(-1);
		},
		runSolo: () => {
			run(false);
		},
		runTeam: () => {
			run(true);
		},
		dismiss: () => {
			leave("wave");
		},
	};
};
