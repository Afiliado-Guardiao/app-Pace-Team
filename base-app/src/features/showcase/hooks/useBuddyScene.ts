import { useEffect, useState } from "react";

import * as Haptics from "expo-haptics";

// back = traseira (2 toques) · lock = tela de bloqueio · buddy = o Buddy
// acenando · card = "Bora correr?" · pick = toque em "Correr com a equipe"
export type IBuddyScenePhase = "back" | "lock" | "buddy" | "card" | "pick";

const STEPS: readonly [IBuddyScenePhase, number][] = [
	["lock", 1500],
	["buddy", 1850],
	["card", 2300],
	["pick", 4200],
];
const TAPS = [650, 1050] as const;

// Linha do tempo da cena "Chame o Buddy" (5,6 s), igual ao Cloud Design
export const useBuddyScene = () => {
	const [phase, setPhase] = useState<IBuddyScenePhase>("back");
	const [taps, setTaps] = useState(0);

	useEffect(() => {
		const timers = [
			...TAPS.map((at, i) =>
				setTimeout(() => {
					setTaps(i + 1);
					void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
				}, at),
			),
			...STEPS.map(([p, at]) =>
				setTimeout(() => {
					setPhase(p);
				}, at),
			),
		];
		return () => {
			timers.forEach(clearTimeout);
		};
	}, []);

	return { phase, taps };
};
