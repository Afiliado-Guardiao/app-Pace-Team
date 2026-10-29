// Roteiro do Buddy que corre pelas telas: entra correndo por um lado, para
// no meio, olha para o atleta, reage ao humor do dia, olha para a frente e
// sai pelo outro lado. Depois de uma pausa, volta no sentido contrário.
import { IBuddyAct } from "@/lib/buddy/constants";
import { IBuddyMood, IBuddyVitals } from "@/lib/buddy/useBuddyMood";

import { IBuddyPose } from "../BuddyFigure";

export type IRunnerStage = "away" | "run" | "stop" | "react" | "look";

// Mesmo tamanho do Buddy parado no botão do Perfil
export const RUNNER_SCALE = 0.42;
export const RUNNER_W = 140 * RUNNER_SCALE;
export const RUNNER_H = 135 * RUNNER_SCALE;
// Onde fica o chão (a base do espiral) dentro do desenho
export const RUNNER_FEET = 119 * RUNNER_SCALE;

// px por segundo: o espiral gira rápido, mas ele anda devagar para dar
// tempo de tocar nele; doente, anda mais devagar ainda
export const RUN_SPEED = 42;
export const SICK_SPEED = 22;

export const TIMES = {
	firstDelay: 1600,
	stop: 1100,
	look: 750,
	awayMin: 6000,
	awayExtra: 7000,
	awayCheck: 500,
} as const;

// Quanto tempo dura cada gesto quando ele para
const ACT_MS: Partial<Record<IBuddyAct, number>> = {
	celebrate: 2600,
	sleep: 3200,
	curious: 1900,
	shake: 900,
	wave: 1500,
	excited: 1400,
	impressed: 1500,
	wink: 1100,
	salute: 1400,
	tilt: 1400,
	sick: 2000,
	armsUp: 1300,
	peek: 1800,
	wake: 1200,
};

// Gestos de cada humor: correu hoje comemora; com a vida baixando fica
// com sono e curioso ("não vai correr?"); doente só fica doente
const ACTS = {
	celebrate: ["celebrate", "celebrate", "excited", "impressed", "armsUp", "wave"],
	normal: ["wave", "curious", "shake", "wink", "salute", "tilt", "armsUp", "impressed"],
	tired: ["sleep", "sleep", "peek", "wake", "curious", "shake", "tilt"],
	sick: ["sick"],
} as const satisfies Record<string, readonly IBuddyAct[]>;

// Vida abaixo disso: o Buddy já anda com sono
const TIRED_LIFE = 0.6;

export const reactionFor = (act: IBuddyAct): { act: IBuddyAct; ms: number } => ({
	act,
	ms: ACT_MS[act] ?? 1400,
});

// Reação ao parar, sorteada entre os gestos do humor do dia
export const reactionOf = (vitals: IBuddyVitals, lucky: number): { act: IBuddyAct; ms: number } => {
	const tired = vitals.mood === "normal" && vitals.life < TIRED_LIFE;
	const list: readonly IBuddyAct[] = tired ? ACTS.tired : ACTS[vitals.mood];
	return reactionFor(list[Math.floor(lucky * list.length)] ?? "wave");
};

const pose = (act: IBuddyAct, phase: IBuddyPose["phase"] = null): IBuddyPose => ({
	act,
	phase,
	blink: false,
	gx: 0,
	gy: 0,
});

// Pose de cada momento do roteiro: correndo, vai em cima do espiral laranja
// com os riscos de velocidade (fase "ring" do design); doente, só anda
export const poseOf = (stage: IRunnerStage, mood: IBuddyMood, reaction: IBuddyAct): IBuddyPose => {
	const isSick = mood === "sick";
	if (stage === "run" || stage === "away") return isSick ? pose("sick") : pose("idle", "ring");
	if (stage === "react") return pose(reaction);
	if (stage === "look") return pose(isSick ? "sick" : "look");
	return pose(isSick ? "sick" : "idle");
};

// Ponto da parada: entre 30% e 65% do caminho
export const stopPoint = (from: number, to: number, lucky: number): number =>
	from + (to - from) * (0.3 + lucky * 0.35);
