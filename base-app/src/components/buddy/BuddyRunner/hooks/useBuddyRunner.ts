import { useCallback, useState } from "react";
import { useWindowDimensions } from "react-native";

import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";

import {
	cancelAnimation,
	Easing,
	SharedValue,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

import { IBuddyAct } from "@/lib/buddy/constants";
import { useBuddyLook } from "@/lib/buddy/useBuddyLook";
import { IBuddyVitals, useBuddyMood } from "@/lib/buddy/useBuddyMood";
import { ROUTES } from "@/constants/routes";

import {
	IRunnerStage,
	poseOf,
	reactionOf,
	RUN_SPEED,
	RUNNER_W,
	SICK_SPEED,
	stopPoint,
	TIMES,
} from "../script";

interface ILoop {
	width: number;
	vitals: IBuddyVitals;
	x: SharedValue<number>;
	setStage: (stage: IRunnerStage) => void;
	setDir: (dir: 1 | -1) => void;
	setReaction: (act: IBuddyAct) => void;
}

// Uma volta do roteiro (ida ou volta) com timers canceláveis
const runLoop = (loop: ILoop): (() => void) => {
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
		const reaction = reactionOf(loop.vitals, Math.random());
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

	const play = async (): Promise<void> => {
		let dir: 1 | -1 = 1;
		await wait(TIMES.firstDelay);
		while (isAlive) {
			await lap(dir);
			dir = dir === 1 ? -1 : 1;
			await wait(TIMES.awayMin + Math.random() * TIMES.awayExtra);
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

// Buddy que corre pelas telas: só anda com a tela aberta e some com
// "Reduzir movimento". Tocar nele abre "Seu Buddy".
export const useBuddyRunner = () => {
	const router = useRouter();
	const { width } = useWindowDimensions();
	const isReduced = useReducedMotion();
	const look = useBuddyLook();
	const vitals = useBuddyMood();
	const { mood, life } = vitals;
	const x = useSharedValue(-RUNNER_W);
	const [stage, setStage] = useState<IRunnerStage>("away");
	const [dir, setDir] = useState<1 | -1>(1);
	const [reaction, setReaction] = useState<IBuddyAct>("wave");

	useFocusEffect(
		useCallback(() => {
			if (isReduced) return undefined;
			return runLoop({ width, vitals: { mood, life }, x, setStage, setDir, setReaction });
		}, [isReduced, width, mood, life, x]),
	);

	const moveStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

	return {
		isVisible: !isReduced,
		width,
		dir,
		look,
		pose: poseOf(stage, mood, reaction),
		life,
		// "+1" subindo em cima dele quando comemora a corrida do dia
		hasPoint: stage === "react" && reaction === "celebrate",
		moveStyle,
		open: () => {
			void Haptics.selectionAsync();
			router.push(ROUTES.BUDDY);
		},
	};
};
