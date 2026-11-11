import { useCallback, useEffect, useRef, useState } from "react";

import * as Speech from "expo-speech";
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";

import { IFloatingToastData } from "@/components/pace";

import { VOICE_ERRORS } from "../constants";

interface IUseAiVoiceReturn {
	isListening: boolean;
	// O atleta perguntou por voz: o Buddy lê a resposta em voz alta
	isSpeakOn: boolean;
	heard: string;
	listen: () => void;
	stopListening: () => void;
	toggleSpeak: () => void;
	speak: (text: string) => void;
}

const LANG = "pt-BR";

// Voz no próprio iPhone: a fala vira texto (reconhecimento no aparelho quando
// disponível) e a resposta do Buddy pode ser lida em voz alta.
export const useAiVoice = (
	onHeard: (text: string) => void,
	showToast: (t: IFloatingToastData) => void,
): IUseAiVoiceReturn => {
	const [isListening, setIsListening] = useState(false);
	const [isSpeakOn, setIsSpeakOn] = useState(false);
	const [heard, setHeard] = useState("");
	const finalRef = useRef("");

	useSpeechRecognitionEvent("start", () => {
		setIsListening(true);
	});
	useSpeechRecognitionEvent("result", (event) => {
		const text = event.results[0]?.transcript ?? "";
		setHeard(text);
		if (event.isFinal) finalRef.current = text;
	});
	useSpeechRecognitionEvent("end", () => {
		setIsListening(false);
		const text = (finalRef.current || "").trim();
		finalRef.current = "";
		setHeard("");
		if (text) onHeard(text);
	});
	useSpeechRecognitionEvent("error", (event) => {
		setIsListening(false);
		if (event.error === "not-allowed") showToast({ tone: "danger", ...VOICE_ERRORS.denied });
	});

	useEffect(
		() => () => {
			void Speech.stop();
		},
		[],
	);

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
			ExpoSpeechRecognitionModule.start({
				lang: LANG,
				interimResults: true,
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
		listen,
		stopListening: () => {
			ExpoSpeechRecognitionModule.stop();
		},
		toggleSpeak: () => {
			if (isSpeakOn) void Speech.stop();
			setIsSpeakOn(!isSpeakOn);
		},
		speak: (text) => {
			if (!isSpeakOn) return;
			void Speech.stop();
			Speech.speak(text.replace(/• /g, ""), { language: LANG, rate: 1.02 });
		},
	};
};
