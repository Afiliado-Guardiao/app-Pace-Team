import { Voice, VoiceQuality } from "expo-speech";

// Vozes masculinas do iPhone em português do Brasil
const MALE = ["felipe", "daniel"];
// Vozes de efeito (Eloquence/novidade): soam de robô, nunca escolher
const ROBOTIC = ["eddy", "reed", "rocko", "grandpa", "grandma", "flo", "sandy", "shelley"];

// Premium (iOS 16+) aparece como "Default" no expo-speech: o identificador diz
const qualityOf = (v: Voice): number => {
	const id = v.identifier.toLowerCase();
	if (id.includes(".premium.")) return 3;
	if (id.includes(".enhanced.") || v.quality === VoiceQuality.Enhanced) return 2;
	return 1;
};

const score = (v: Voice): number => {
	const name = v.name.toLowerCase();
	if (ROBOTIC.some((r) => name.includes(r))) return -1;
	const isMale = MALE.some((m) => name.includes(m));
	// Qualidade primeiro (é o que tira o tom de robô); masculina desempata
	return qualityOf(v) * 100 + (isMale ? 60 : 0);
};

const isPtBr = (v: Voice): boolean => v.language.toLowerCase().replace("_", "-") === "pt-br";

// Melhor voz pt-BR do iPhone: Premium > Aprimorada > Compacta
export const pickVoice = (voices: Voice[]): string | undefined => {
	const best = voices
		.filter((v) => isPtBr(v) && score(v) >= 0)
		.sort((a, b) => score(b) - score(a))
		.at(0);
	return best ? best.identifier : undefined;
};

// A melhor voz ainda é a compacta (a de robô)? Vale avisar como baixar a boa
export const hasOnlyBasicVoice = (voices: Voice[]): boolean =>
	!voices.some((v) => isPtBr(v) && qualityOf(v) >= 2);
