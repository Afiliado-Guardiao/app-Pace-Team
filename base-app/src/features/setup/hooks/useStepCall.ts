import { useEffect, useRef, useState } from "react";

import * as Haptics from "expo-haptics";

import { SETUP_COPY } from "../constants";

type ICallMode = "tap" | "siri";

interface IUseStepCallReturn {
	mode: ICallMode;
	setMode: (mode: ICallMode) => void;
	// Toque duplo: muda a cada 4,6 s (2 toques, o Bud surge e fala)
	tapBeat: number;
	// Toque duplo: o Bud só aparece depois dos 2 toques
	isBuddyIn: boolean;
	// Siri: frase tocada e se ainda está "ouvindo"
	phrase: number | null;
	isListening: boolean;
	bubble: string;
	say: (index: number) => void;
}

const BEAT_MS = 4600;
const LISTEN_MS = 1300;
// Os 2 toques (0 e 400 ms) e as ondas; o Bud surge logo depois
const BUDDY_IN_MS = 1400;

// 3b · como chamar o Buddy: toque duplo atrás do celular ou a Siri
export const useStepCall = (): IUseStepCallReturn => {
	const [mode, setMode] = useState<ICallMode>("tap");
	const [tapBeat, setTapBeat] = useState(0);
	const [isBuddyIn, setIsBuddyIn] = useState(false);
	const [phrase, setPhrase] = useState<number | null>(null);
	const [isListening, setIsListening] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (mode !== "tap") return undefined;
		const beat = setInterval(() => {
			setTapBeat((n) => n + 1);
		}, BEAT_MS);
		return () => {
			clearInterval(beat);
		};
	}, [mode]);

	// A cada batida: some o Bud, vibra nos 2 toques e ele aparece de novo
	useEffect(() => {
		if (mode !== "tap") return undefined;
		setIsBuddyIn(false);
		const tap = () =>
			void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
		tap();
		const second = setTimeout(tap, 400);
		const show = setTimeout(() => {
			setIsBuddyIn(true);
		}, BUDDY_IN_MS);
		return () => {
			clearTimeout(second);
			clearTimeout(show);
		};
	}, [mode, tapBeat]);

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
		},
		[],
	);

	const reply = phrase === null ? null : SETUP_COPY.callPhrases[phrase]?.reply;
	const bubble = mode === "tap" ? SETUP_COPY.callTapBubble : (reply ?? SETUP_COPY.callSiriText);

	return {
		mode,
		setMode,
		tapBeat,
		isBuddyIn: mode === "siri" || isBuddyIn,
		phrase,
		isListening,
		bubble: isListening ? SETUP_COPY.callListening : bubble,
		say: (index) => {
			if (timer.current) clearTimeout(timer.current);
			setPhrase(index);
			setIsListening(true);
			timer.current = setTimeout(() => {
				setIsListening(false);
			}, LISTEN_MS);
		},
	};
};
