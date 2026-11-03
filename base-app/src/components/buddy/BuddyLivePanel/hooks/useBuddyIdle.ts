import { useCallback, useEffect, useRef, useState } from "react";

import * as Haptics from "expo-haptics";

import { IBuddyAct } from "@/lib/buddy/constants";

import { IDLE_STEPS, IIdleStep } from "../speech";

// Tempo da cara de "acordei" antes de ele voltar a acenar
const WAKE_MS = 900;

interface IUseBuddyIdleReturn {
	// Fala de quando ninguém toca (curioso, inquieto, com sono); null = normal
	idleSpeech: { title: string; subtitle: string } | null;
	// Qualquer toque no painel: ele para de cobrar e, se dormia, acorda
	bump: () => void;
}

// Buddy vivo sem ninguém tocar: fica curioso ("?"), inquieto cobrando uma
// atitude e, por fim, com sono até dormir. Cada toque recomeça a contagem.
export const useBuddyIdle = (
	isOpen: boolean,
	setAct: (act: IBuddyAct) => void,
): IUseBuddyIdleReturn => {
	const [step, setStep] = useState<IIdleStep | null>(null);
	const [round, setRound] = useState(0);
	const stepRef = useRef<IIdleStep | null>(null);
	const wakeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => {
		if (!isOpen) return undefined;
		stepRef.current = null;
		setStep(null);
		const timers = IDLE_STEPS.map((next) =>
			setTimeout(() => {
				stepRef.current = next;
				setStep(next);
				setAct(next.act);
				if (next.isNudge) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			}, next.at),
		);
		return () => {
			timers.forEach(clearTimeout);
		};
	}, [isOpen, round, setAct]);

	useEffect(
		() => () => {
			clearTimeout(wakeTimer.current);
		},
		[],
	);

	const bump = useCallback(() => {
		const was = stepRef.current;
		setRound((r) => r + 1);
		if (was === null) return;
		if (was.isAsleep) {
			setAct("wake");
			clearTimeout(wakeTimer.current);
			wakeTimer.current = setTimeout(() => {
				setAct("wave");
			}, WAKE_MS);
		} else {
			setAct("idle");
		}
	}, [setAct]);

	return { idleSpeech: step, bump };
};
