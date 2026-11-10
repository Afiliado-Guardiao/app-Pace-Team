import { useEffect, useRef, useState } from "react";

import * as Haptics from "expo-haptics";

import { SETUP_COPY } from "../constants";

type ICallMode = "tap" | "siri";

interface IUseStepCallReturn {
	mode: ICallMode;
	setMode: (mode: ICallMode) => void;
	// Toque duplo: muda a cada 3,4 s (anima as ondas "2×" de novo)
	tapBeat: number;
	// Siri: frase tocada e se ainda está "ouvindo"
	phrase: number | null;
	isListening: boolean;
	bubble: string;
	say: (index: number) => void;
}

const BEAT_MS = 3400;
const LISTEN_MS = 1300;

// 3b · como chamar o Buddy: toque duplo atrás do celular ou a Siri
export const useStepCall = (): IUseStepCallReturn => {
	const [mode, setMode] = useState<ICallMode>("tap");
	const [tapBeat, setTapBeat] = useState(0);
	const [phrase, setPhrase] = useState<number | null>(null);
	const [isListening, setIsListening] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (mode !== "tap") return undefined;
		const beat = setInterval(() => {
			setTapBeat((n) => n + 1);
			void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
		}, BEAT_MS);
		return () => {
			clearInterval(beat);
		};
	}, [mode]);

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
