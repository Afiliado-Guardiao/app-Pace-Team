import { useEffect, useState } from "react";

import { SharedValue, useAnimatedStyle } from "react-native-reanimated";

import { IBuddyPose } from "@/components/buddy";
import { IBuddyAct } from "@/lib/buddy/constants";
import { useBuddyLook } from "@/lib/buddy/useBuddyLook";
import { useBuddyMood } from "@/lib/buddy/useBuddyMood";

const BLINK_MS = 140;
const BLINK_EVERY = { min: 2600, extra: 2400 } as const;
// Vida baixa (2 dias de 7 ou menos): ele fica com sono; zerou, fica doente
const SLEEPY_LIFE = 0.3;
// Pulinho do toque (o mesmo da pelúcia): sobe 8 e amassa de leve
const JUMP_Y = 8;
const SQUASH = 0.05;

export interface IUseTrackBuddyReturn {
	pose: IBuddyPose;
	look: ReturnType<typeof useBuddyLook>;
	life: number;
	hopStyle: ReturnType<typeof useAnimatedStyle>;
}

const actOf = (mood: string, life: number): IBuddyAct => {
	if (mood === "sick") return "sick";
	if (life <= SLEEPY_LIFE) return "sleep";
	return "idle";
};

// Bud sentado na pista do Início: pisca sozinho, fica com sono quando a vida
// está acabando e doente quando zera; pula quando tocado.
export const useTrackBuddy = (jump: SharedValue<number>, k: number): IUseTrackBuddyReturn => {
	const look = useBuddyLook();
	const { mood, life } = useBuddyMood();
	const act = actOf(mood, life);
	const [isBlinking, setIsBlinking] = useState(false);

	useEffect(() => {
		if (act !== "idle") return undefined;
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
	}, [act]);

	const hopStyle = useAnimatedStyle(() => {
		const lift = Math.sin(Math.PI * jump.value);
		return {
			transform: [
				{ translateY: -lift * JUMP_Y * k },
				{ scaleX: 1 + lift * SQUASH },
				{ scaleY: 1 - lift * SQUASH },
			],
		};
	});

	return {
		pose: { act, phase: null, blink: isBlinking, gx: 0, gy: 0 },
		look,
		life,
		hopStyle,
	};
};
