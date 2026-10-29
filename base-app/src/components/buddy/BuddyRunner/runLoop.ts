import { cancelAnimation, Easing, SharedValue, withTiming } from "react-native-reanimated";

import { IBuddyAct } from "@/lib/buddy/constants";
import { useBuddyLive } from "@/lib/buddy/liveStore";
import { IBuddyVitals } from "@/lib/buddy/useBuddyMood";

import {
	IRunnerStage,
	reactionFor,
	reactionOf,
	RUN_SPEED,
	RUNNER_W,
	SICK_SPEED,
	stopPoint,
	TIMES,
} from "./script";

export interface ILoop {
	width: number;
	vitals: IBuddyVitals;
	x: SharedValue<number>;
	setStage: (stage: IRunnerStage) => void;
	setDir: (dir: 1 | -1) => void;
	setReaction: (act: IBuddyAct) => void;
}

// Uma volta do roteiro (ida ou volta) com timers canceláveis
export const runLoop = (loop: ILoop): (() => void) => {
	let isAlive = true;
	const timers: ReturnType<typeof setTimeout>[] = [];
	const wait = (ms: number) =>
		new Promise<void>((resolve) => {
			timers.push(setTimeout(resolve, ms));
		});
	const speed = loop.vitals.mood === "sick" ? SICK_SPEED : RUN_SPEED;
	const moveTo = (to: number) => {
		const ms = (Math.abs(to - loop.x.value) / speed) * 1000;
		loop.x.value = withTiming(to, { duration: ms, easing: Easing.linear });
		return wait(ms);
	};

	const lap = async (dir: 1 | -1): Promise<void> => {
		const from = dir === 1 ? -RUNNER_W : loop.width;
		const to = dir === 1 ? loop.width : -RUNNER_W;
		// Curtida, post ou ranking que aconteceu agora vira o gesto desta parada
		const pending = useBuddyLive.getState().takePendingAct();
		const reaction = pending ? reactionFor(pending) : reactionOf(loop.vitals, Math.random());
		loop.x.value = from;
		loop.setDir(dir);
		loop.setReaction(reaction.act);
		loop.setStage("run");
		await moveTo(stopPoint(from, to, Math.random()));
		const steps: [IRunnerStage, number][] = [
			["stop", TIMES.stop],
			["react", reaction.ms],
			["look", TIMES.look],
		];
		for (const [stage, ms] of steps) {
			if (!isAlive) return;
			loop.setStage(stage);
			await wait(ms);
		}
		if (!isAlive) return;
		loop.setStage("run");
		await moveTo(to);
		loop.setStage("away");
	};

	// Fora da tela até a hora de voltar, ou antes se algo aconteceu (curtida…)
	const waitAway = async (): Promise<void> => {
		const until = Date.now() + TIMES.awayMin + Math.random() * TIMES.awayExtra;
		while (isAlive && Date.now() < until && !useBuddyLive.getState().pendingAct) {
			await wait(TIMES.awayCheck);
		}
	};

	const play = async (): Promise<void> => {
		let dir: 1 | -1 = 1;
		await wait(TIMES.firstDelay);
		while (isAlive) {
			await lap(dir);
			dir = dir === 1 ? -1 : 1;
			await waitAway();
		}
	};
	void play();

	return () => {
		isAlive = false;
		timers.forEach(clearTimeout);
		cancelAnimation(loop.x);
		loop.x.value = -RUNNER_W;
		loop.setStage("away");
	};
};
