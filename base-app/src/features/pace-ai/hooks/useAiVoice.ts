import { useCallback, useEffect, useRef, useState } from "react";

import * as Speech from "expo-speech";
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";

import { IFloatingToastData } from "@/components/pace";

import { VOICE_ERRORS, VOICE_SPEEDS } from "../constants";
import { pickVoice } from "../utils/pickVoice";

interface IUseAiVoiceReturn {
	isListening: boolean;
	// O atleta usou a voz: o Buddy lê a resposta em voz alta
	isSpeakOn: boolean;
	heard: string;
	speedLabel: string;
	listen: () => void;
	stopListening: () => void;
	toggleSpeak: () => void;
	cycleSpeed: () => void;
	speak: (text: string) => void;
}

const LANG = "pt-BR";

// Voz no próprio iPhone. A fala vira texto no campo (não envia sozinha: o
// atleta pensa, corrige e toca em Enviar). A resposta pode ser lida em voz
// alta, com voz masculina natural quando o iPhone tiver, em 1x, 1,5x ou 2x.
export const useAiVoice = (
	onHeard: (text: string) => void,
	showToast: (t: IFloatingToastData) => void,
): IUseAiVoiceReturn => {
	const [isListening, setIsListening] = useState(false);
	const [isSpeakOn, setIsSpeakOn] = useState(false);
	const [heard, setHeard] = useState("");
	const [speed, setSpeed] = useState(0);
	const finalRef = useRef("");
	const voiceRef = useRef<string | undefined>(undefined);
	const lastRef = useRef("");

	useEffect(() => {
		void Speech.getAvailableVoicesAsync()
			.then((voices) => {
				voiceRef.current = pickVoice(voices);
			})
			.catch(() => undefined);
		return () => {
			void Speech.stop();
		};
	}, []);

	useSpeechRecognitionEvent("start", () => {
		setIsListening(true);
	});
	useSpeechRecognitionEvent("result", (event) => {
		const text = event.results[0]?.transcript ?? "";
		setHeard(text);
		finalRef.current = text;
	});
	useSpeechRecognitionEvent("end", () => {
		setIsListening(false);
		const text = finalRef.current.trim();
		finalRef.current = "";
		setHeard("");
		if (text) onHeard(text);
	});
	useSpeechRecognitionEvent("error", (event) => {
		setIsListening(false);
		if (event.error === "not-allowed") showToast({ tone: "danger", ...VOICE_ERRORS.denied });
	});

	const say = useCallback((text: string, index: number) => {
		void Speech.stop();
		Speech.speak(text.replace(/• /g, ""), {
			language: LANG,
			voice: voiceRef.current,
			rate: VOICE_SPEEDS[index]?.rate ?? 1,
		});
	}, []);

	const listen = useCallback(() => {
		void Speech.stop();
		void (async () => {
			if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
				showToast({ tone: "danger", ...VOICE_ERRORS.unavailable });
				return;
			}
			const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
			if (!permission.granted) {
				showToast({ tone: "danger", ...VOICE_ERRORS.denied });
				return;
			}
			setIsSpeakOn(true);
			// Contínuo: uma pausa para pensar não encerra; para no toque do microfone
			ExpoSpeechRecognitionModule.start({
				lang: LANG,
				interimResults: true,
				continuous: true,
				addsPunctuation: true,
				requiresOnDeviceRecognition: ExpoSpeechRecognitionModule.supportsOnDeviceRecognition(),
			});
		})().catch(() => {
			showToast({ tone: "danger", ...VOICE_ERRORS.unavailable });
		});
	}, [showToast]);

	return {
		isListening,
		isSpeakOn,
		heard,
		speedLabel: VOICE_SPEEDS[speed]?.label ?? "1x",
		listen,
		stopListening: () => {
			ExpoSpeechRecognitionModule.stop();
		},
		toggleSpeak: () => {
			if (isSpeakOn) void Speech.stop();
			setIsSpeakOn(!isSpeakOn);
		},
		cycleSpeed: () => {
			const next = (speed + 1) % VOICE_SPEEDS.length;
			setSpeed(next);
			// Trocou no meio da leitura: continua na nova velocidade
			void Speech.isSpeakingAsync()
				.then((isSpeaking) => {
					if (isSpeaking && lastRef.current) say(lastRef.current, next);
				})
				.catch(() => undefined);
		},
		speak: (text) => {
			lastRef.current = text;
			if (isSpeakOn) say(text, speed);
		},
	};
};
