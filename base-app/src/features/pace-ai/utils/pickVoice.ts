import { Voice, VoiceQuality } from "expo-speech";

// Vozes masculinas do iPhone em português do Brasil (da mais natural à menos)
const MALE = ["felipe", "daniel", "eddy", "reed", "rocko", "grandpa"];

const score = (v: Voice): number => {
	const name = v.name.toLowerCase();
	const male = MALE.findIndex((m) => name.includes(m));
	const isEnhanced = v.quality === VoiceQuality.Enhanced;
	const maleScore = male >= 0 ? 100 - male * 10 : 0;
	return maleScore + (isEnhanced ? 50 : 0);
};

// Melhor voz pt-BR: masculina e "aprimorada" quando o iPhone tiver baixado
export const pickVoice = (voices: Voice[]): string | undefined => {
	const ptBr = voices.filter((v) => v.language.toLowerCase().replace("_", "-") === "pt-br");
	const best = [...ptBr].sort((a, b) => score(b) - score(a)).at(0);
	return best ? best.identifier : undefined;
};
