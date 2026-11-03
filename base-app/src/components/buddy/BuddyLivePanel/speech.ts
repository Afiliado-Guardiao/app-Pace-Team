import { IBuddyAct } from "@/lib/buddy/constants";

// Mesmas falas do cartão do iPhone (targets/buddy-widget/_shared/BuddySpeech.swift)
export const speechOf = (km: number): { title: string; subtitle: string } => {
	if (km >= 42)
		return { title: "Uma maratona inteira?!", subtitle: "Respeito total. Hidrata e bora." };
	if (km >= 21)
		return { title: "Meia maratona?!", subtitle: "Meta de atleta. Vai com calma no ritmo." };
	if (km >= 15)
		return {
			title: `Uau, ${String(km)} km?!`,
			subtitle: "Meta alta. O time vai sentir esse treino.",
		};
	return { title: "Bora correr?", subtitle: "Escolhe a meta e como você vai." };
};

// Reação à meta: quanto maior, mais animado; diminuindo, uma piscadinha
export const actForGoal = (km: number, delta: number): IBuddyAct => {
	if (delta < 0) return "wink";
	if (km >= 42) return "celebrate";
	if (km >= 21) return "armsUp";
	if (km >= 15) return "impressed";
	if (km >= 10) return "excited";
	return "wave";
};

// Cada toque no Buddy faz o próximo gesto
export const TAP_ACTS: readonly IBuddyAct[] = [
	"wave",
	"wink",
	"armsUp",
	"curious",
	"excited",
	"tilt",
	"impressed",
	"salute",
	"shake",
	"celebrate",
];

export interface IIdleStep {
	// Quanto tempo sem toque até este momento (ms)
	at: number;
	act: IBuddyAct;
	title: string;
	subtitle: string;
	isAsleep?: boolean;
	// Vibra de leve para cobrar uma atitude
	isNudge?: boolean;
}

const RESTLESS = {
	title: "Tô ficando inquieto!",
	subtitle: "A meta não se corre sozinha.",
} as const;

// Ninguém tocou: curioso, depois inquieto cobrando, depois com sono até dormir
export const IDLE_STEPS: readonly IIdleStep[] = [
	{ at: 5000, act: "curious", title: "E aí, bora?", subtitle: "Tô esperando você escolher." },
	{ at: 10000, act: "shake", ...RESTLESS, isNudge: true },
	{ at: 12500, act: "tilt", ...RESTLESS },
	{ at: 14500, act: "shake", ...RESTLESS, isNudge: true },
	{
		at: 19000,
		act: "peek",
		title: "Tô com soninho…",
		subtitle: "Se a gente não correr, eu cochilo.",
		isAsleep: true,
	},
	{
		at: 24000,
		act: "sleep",
		title: "Zzz…",
		subtitle: "Toca em mim pra me acordar.",
		isAsleep: true,
	},
];
