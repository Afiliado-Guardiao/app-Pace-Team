import { useEffect, useRef, useState } from "react";

import * as Haptics from "expo-haptics";

import { SETUP_COPY } from "../constants";

export type ICallMode = "tap" | "siri" | "water" | "watch";

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

const MODES: readonly ICallMode[] = ["tap", "siri", "water", "watch"];
export const toCallMode = (value: string): ICallMode => MODES.find((m) => m === value) ?? "tap";

// Frases da Siri de cada aba (correr ou perguntar da água)
export const phrasesOf = (mode: ICallMode): readonly { say: string; reply: string }[] => {
	if (mode === "siri") return SETUP_COPY.callPhrases;
	if (mode === "water") return SETUP_COPY.callWaterPhrases;
	return [];
};

// O que o Bud diz no balão em cada aba
const bubbleOf = (mode: ICallMode, phrase: number | null): string => {
	if (mode === "tap") return SETUP_COPY.callTapBubble;
	if (mode === "watch") return SETUP_COPY.callWatchBubble;
	const reply = phrase === null ? null : phrasesOf(mode)[phrase]?.reply;
	return reply ?? (mode === "water" ? SETUP_COPY.callWaterText : SETUP_COPY.callSiriText);
};

// 3b · como chamar o Buddy: toque duplo, Siri, água (Pro) e relógio
export const useStepCall = (): IUseStepCallReturn => {
	const [mode, setModeState] = useState<ICallMode>("tap");
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

	return {
		mode,
		// Trocar de aba limpa a frase tocada na aba anterior
		setMode: (next) => {
			setPhrase(null);
			setIsListening(false);
			setModeState(next);
		},
		tapBeat,
		isBuddyIn: mode !== "tap" || isBuddyIn,
		phrase,
		isListening,
		bubble: isListening ? SETUP_COPY.callListening : bubbleOf(mode, phrase),
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
