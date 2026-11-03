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
