import { useCallback, useEffect, useRef, useState } from "react";

import * as Speech from "expo-speech";

import { VOICE_SPEEDS } from "../constants";
import { hasOnlyBasicVoice, pickVoice } from "../utils/pickVoice";
import { splitSentences, toSpeechText } from "../utils/speechText";

export interface IUseAiSpeakerReturn {
	// Lê as respostas novas sozinho (liga quando o atleta usa o microfone)
	isSpeakOn: boolean;
	turnOn: () => void;
	toggleSpeak: () => void;
	speedLabel: string;
	cycleSpeed: () => void;
	// Resposta nova: lê se a leitura automática estiver ligada
	speak: (text: string) => void;
	// "Ouvir de novo" no balão: lê aquela resposta (ou para, se já estiver lendo)
	togglePlay: (text: string) => void;
	// Texto que está sendo lido agora (o balão mostra "Parar")
	playing: string | null;
	// O iPhone só tem a voz básica: mostra como baixar a natural
	isBasicVoice: boolean;
	stop: () => void;
}

const LANG = "pt-BR";

// Voz do Buddy no próprio iPhone: a melhor voz pt-BR instalada, texto
// preparado para a fala e lido frase por frase (com respiro entre elas).
export const useAiSpeaker = (): IUseAiSpeakerReturn => {
	const [isSpeakOn, setIsSpeakOn] = useState(false);
	const [speed, setSpeed] = useState(0);
	const [playing, setPlaying] = useState<string | null>(null);
	const [isBasicVoice, setIsBasicVoice] = useState(false);
	const voiceRef = useRef<string | undefined>(undefined);
	const runRef = useRef(0);

	useEffect(() => {
		void Speech.getAvailableVoicesAsync()
			.then((voices) => {
				voiceRef.current = pickVoice(voices);
				setIsBasicVoice(voices.length > 0 && hasOnlyBasicVoice(voices));
			})
			.catch(() => undefined);
		return () => {
			void Speech.stop();
		};
	}, []);

	const stop = useCallback(() => {
		runRef.current += 1;
		setPlaying(null);
		void Speech.stop();
	}, []);

	const say = useCallback((text: string, index: number) => {
		runRef.current += 1;
		const run = runRef.current;
		void Speech.stop();
		const chunks = splitSentences(toSpeechText(text));
		if (chunks.length === 0) return;
		setPlaying(text);
		const finish = () => {
			// Só a leitura atual limpa o estado (uma nova pode ter começado)
			if (runRef.current === run) setPlaying(null);
		};
		chunks.forEach((chunk, i) => {
			const isLast = i === chunks.length - 1;
			Speech.speak(chunk, {
				language: LANG,
				voice: voiceRef.current,
				rate: VOICE_SPEEDS[index]?.rate ?? 1,
				pitch: 1,
				onDone: isLast ? finish : undefined,
				onError: finish,
			});
		});
	}, []);

	const turnOn = useCallback(() => {
		setIsSpeakOn(true);
	}, []);

	return {
		isSpeakOn,
		turnOn,
		toggleSpeak: () => {
			if (isSpeakOn) stop();
			setIsSpeakOn(!isSpeakOn);
		},
		speedLabel: VOICE_SPEEDS[speed]?.label ?? "1x",
		cycleSpeed: () => {
			const next = (speed + 1) % VOICE_SPEEDS.length;
			setSpeed(next);
			// Trocou no meio da leitura: recomeça na nova velocidade
			if (playing) say(playing, next);
		},
		speak: (text) => {
			if (isSpeakOn) say(text, speed);
		},
		togglePlay: (text) => {
			if (playing === text) stop();
			else say(text, speed);
		},
		playing,
		isBasicVoice,
		stop,
	};
};
