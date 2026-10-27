// Pose do Pace Buddy para cada gesto/fase (o "bud()" do design, como dados).
import { TransformsStyle } from "react-native";

import { IBuddyAct, IBuddyPhase } from "@/lib/buddy/constants";

import { anim, EASE_OUT } from "../animations";

export interface IBuddyPose {
	act: IBuddyAct;
	phase: IBuddyPhase;
	blink: boolean;
	// Olhar seguindo o dedo (−5…5, −4…4)
	gx: number;
	gy: number;
}

export const isSleepAct = (a: IBuddyAct): boolean => a === "sleep" || a === "peek";
export const isRingPhase = (ph: IBuddyPhase): boolean =>
	ph === "ring" || ph === "max" || ph === "dash";
export const isRunPhase = (ph: IBuddyPhase): boolean => ph === "run" || ph === "legs";

type ITransform = NonNullable<TransformsStyle["transform"]>;

// Inclinação do corpo inteiro (gT)
export const groupTransform = (pose: IBuddyPose): ITransform => {
	const { act: a, phase: ph, gx } = pose;
	if (ph === "legs") return [{ translateY: -5 }];
	if (ph === "run") return [{ translateY: -8 }, { rotate: "7deg" }];
	if (isRingPhase(ph)) return [{ translateY: -14 }, { rotate: "5deg" }];
	if (a === "tilt") return [{ rotate: "-11deg" }];
	if (a === "curious") return [{ rotate: "9deg" }];
	if (a === "armsUp") return [{ translateY: -5 }];
	if (isSleepAct(a)) return [{ translateY: 9 }];
	if (a === "wake") return [{ translateY: -8 }, { scale: 1.04 }];
	if (a === "impressed") return [{ translateY: -6 }, { rotate: "-5deg" }, { scale: 1.04 }];
	if (a === "sick") return [{ translateY: 6 }, { rotate: "-4deg" }];
	return [{ rotate: `${String(gx * 0.8)}deg` }];
};

// Animação contínua do corpo (gA)
export const groupAnimation = (pose: IBuddyPose, isMini: boolean) => {
	const { act: a, phase: ph } = pose;
	if (isMini) return null;
	if (a === "celebrate") return anim("jump", "0.85s", { timing: EASE_OUT });
	if (a === "shake") return anim("buzz", "0.1s", { timing: "linear" });
	if (isSleepAct(a)) return anim("breathe", "2.8s");
	if (a === "sick") return anim("shiver", "2.6s");
	if (isRunPhase(ph)) return anim("bob", "0.17s", { timing: "linear" });
	if (isRingPhase(ph)) return anim("bob", "0.11s", { timing: "linear" });
	if (a === "excited") return anim("hop", "0.55s", { timing: EASE_OUT, count: 2 });
	if (a === "impressed") return anim("hop", "0.5s", { timing: EASE_OUT, count: 1 });
	return anim("float", "3.2s");
};

// Posição das mãos [esquerda, direita] em px (HP do design)
const HAND_POS: Partial<
	Record<IBuddyAct, readonly [readonly [number, number], readonly [number, number]]>
> = {
	wave: [
		[0, 0],
		[4, -30],
	],
	arm: [
		[0, 0],
		[6, -16],
	],
	armsUp: [
		[-6, -36],
		[6, -36],
	],
	salute: [
		[0, 0],
		[-16, -40],
	],
	tilt: [
		[0, -6],
		[2, 10],
	],
	excited: [
		[-7, -22],
		[7, -22],
	],
	curious: [
		[0, 0],
		[-6, -8],
	],
	sleep: [
		[-8, 12],
		[8, 12],
	],
	peek: [
		[-8, 12],
		[8, 12],
	],
	celebrate: [
		[-4, -4],
		[10, -44],
	],
	shake: [
		[-5, -10],
		[5, -10],
	],
	wake: [
		[-8, -26],
		[8, -26],
	],
	impressed: [
		[12, -16],
		[-12, -16],
	],
	sick: [
		[-3, 8],
		[3, 8],
	],
};

export const handPositions = (pose: IBuddyPose) => {
	if (isRunPhase(pose.phase))
		return [
			[-2, -4],
			[2, 2],
		] as const;
	if (isRingPhase(pose.phase))
		return [
			[-10, -10],
			[-6, -6],
		] as const;
	return (
		HAND_POS[pose.act] ??
		([
			[0, 0],
			[0, 0],
		] as const)
	);
};

// Animação de cada mão (HA do design)
export const handAnimation = (pose: IBuddyPose, index: 0 | 1, isMini: boolean) => {
	if (isMini) return null;
	const a = isRunPhase(pose.phase) ? "run" : pose.act;
	if (a === "run")
		return anim("pump", "0.17s", { timing: "linear", delay: index ? "0.08s" : "0s" });
	if (a === "wave" && index === 1) return anim("wave", "0.3s", { direction: "alternate" });
	if (a === "arm" && index === 1)
		return anim("wave", "0.38s", { direction: "alternate", count: 4 });
	if (a === "armsUp") return anim("pump", "0.5s");
	if (a === "excited") return anim("pump", "0.3s", { delay: index ? "0.15s" : "0s" });
	if (a === "celebrate" && index === 1) return anim("wave", "0.25s", { direction: "alternate" });
	return null;
};

// Para onde os olhos olham (ex/ey)
export const eyeOffset = (pose: IBuddyPose): readonly [number, number] => {
	if (pose.phase) return [3, 0];
	const byAct: Partial<Record<IBuddyAct, readonly [number, number]>> = {
		look: [6, -1],
		lookL: [-6, -1],
		curious: [4, -3],
		salute: [-2, -1],
		impressed: [0, -3],
		sick: [0, 2],
	};
	return byAct[pose.act] ?? [pose.gx, pose.gy];
};

// Escala de cada olho (piscar, piscadela, susto…)
export const eyeScale = (pose: IBuddyPose, index: 0 | 1): readonly [number, number] => {
	const { act: a, phase: ph, blink } = pose;
	let sy = 1;
	let sx = 1;
	if (blink) sy = 0.1;
	if (a === "wink" && index === 1) sy = 0.12;
	if (a === "wake") {
		sy = 1.25;
		sx = 1.2;
	}
	if (a === "curious" && index === 1) {
		sy = 0.85;
		sx = 0.85;
	}
	if (ph === "max" || ph === "ring") sy = 0.75;
	if (a === "peek") sy = 0.6;
	if (a === "impressed") {
		sx = 1.3;
		sy = blink ? 0.1 : 1.35;
	}
	return [sx, sy];
};
