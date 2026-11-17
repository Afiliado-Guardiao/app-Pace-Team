import { Voice, VoiceQuality } from "expo-speech";

import { hasOnlyBasicVoice, pickVoice } from "../utils/pickVoice";
import { splitSentences, toSpeechText } from "../utils/speechText";

const voice = (identifier: string, name: string, quality = VoiceQuality.Default): Voice => ({
	identifier,
	name,
	quality,
	language: "pt-BR",
});

describe("texto falado do Buddy", () => {
	it("lê ritmo, tempo e distância por extenso", () => {
		expect(toSpeechText(`Seu ritmo foi 5'07"/km em 10,5 km.`)).toBe(
			"Seu ritmo foi 5 minutos e 7 segundos por quilômetro em 10,5 quilômetros.",
		);
		expect(toSpeechText("Você correu 1:24:30 no longão.")).toBe(
			"Você correu 1 hora, 24 minutos e 30 segundos no longão.",
		);
		expect(toSpeechText("Fez em 54:12, saiu às 19:10.")).toBe(
			"Fez em 54 minutos e 12 segundos, saiu às 19 e 10.",
		);
		expect(toSpeechText("Correu 1 km a 12 km/h")).toBe(
			"Correu 1 quilômetro a 12 quilômetros por hora.",
		);
	});

	it("tira marcadores, negrito e emojis", () => {
		expect(toSpeechText("**Boa semana!** 🔥\n• 3 corridas\n• +120 pts")).toBe(
			"Boa semana! 3 corridas. +120 pontos.",
		);
	});

	it("divide em frases sem deixar pedaço muito curto", () => {
		expect(
			splitSentences("Boa! Você correu bem esta semana, com três treinos. Continue assim."),
		).toEqual(["Boa! Você correu bem esta semana, com três treinos.", "Continue assim."]);
	});
});

describe("escolha da voz", () => {
	it("prefere a voz de melhor qualidade e nunca as de efeito", () => {
		const voices = [
			voice("com.apple.eloquence.pt-BR.Eddy", "Eddy"),
			voice("com.apple.voice.compact.pt-BR.Felipe", "Felipe"),
			voice("com.apple.voice.enhanced.pt-BR.Luciana", "Luciana", VoiceQuality.Enhanced),
			voice("com.apple.voice.enhanced.pt-BR.Felipe", "Felipe", VoiceQuality.Enhanced),
		];
		expect(pickVoice(voices)).toBe("com.apple.voice.enhanced.pt-BR.Felipe");
		expect(pickVoice([...voices, voice("com.apple.voice.premium.pt-BR.Luciana", "Luciana")])).toBe(
			"com.apple.voice.premium.pt-BR.Luciana",
		);
		expect(hasOnlyBasicVoice(voices)).toBe(false);
		expect(hasOnlyBasicVoice(voices.slice(0, 2))).toBe(true);
	});
});
