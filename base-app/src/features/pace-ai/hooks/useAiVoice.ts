import { useCallback, useRef, useState } from "react";

import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";

import { IFloatingToastData } from "@/components/pace";

import { VOICE_ERRORS } from "../constants";

import { IUseAiSpeakerReturn } from "./useAiSpeaker";

interface IUseAiVoiceReturn {
	isListening: boolean;
	heard: string;
	listen: () => void;
	stopListening: () => void;
	// Enviar com o microfone ligado: para de ouvir e devolve o que ele ouviu
	// (sem jogar de novo no campo depois)
	takeHeard: () => string;
}

const LANG = "pt-BR";

// Microfone no próprio iPhone. A fala vira texto no campo (não envia
// sozinha: o atleta pensa, corrige e toca em Enviar). Quem usa o microfone
// passa a ouvir as respostas em voz alta (useAiSpeaker).
export const useAiVoice = (
	onHeard: (text: string) => void,
	showToast: (t: IFloatingToastData) => void,
	speaker: Pick<IUseAiSpeakerReturn, "stop" | "turnOn">,
): IUseAiVoiceReturn => {
	const [isListening, setIsListening] = useState(false);
	const [heard, setHeard] = useState("");
	const finalRef = useRef("");
	const skipRef = useRef(false);
	const { stop: stopSpeaking, turnOn } = speaker;

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
		// Já foi enviado junto com a pergunta (takeHeard)
		if (skipRef.current) {
			skipRef.current = false;
			return;
		}
		if (text) onHeard(text);
	});
	useSpeechRecognitionEvent("error", (event) => {
		setIsListening(false);
		if (event.error === "not-allowed") showToast({ tone: "danger", ...VOICE_ERRORS.denied });
	});

	const listen = useCallback(() => {
		stopSpeaking();
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
			turnOn();
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
	}, [showToast, stopSpeaking, turnOn]);

	return {
		isListening,
		heard,
		listen,
		stopListening: () => {
			ExpoSpeechRecognitionModule.stop();
		},
		takeHeard: () => {
			const text = finalRef.current.trim();
			skipRef.current = true;
			finalRef.current = "";
			setHeard("");
			ExpoSpeechRecognitionModule.stop();
			return text;
		},
	};
};
