import { useCallback, useState } from "react";
import { useWindowDimensions } from "react-native";

import { useFocusEffect, useRouter } from "expo-router";

import { useAnimatedStyle, useReducedMotion, useSharedValue } from "react-native-reanimated";

import { IBuddyAct } from "@/lib/buddy/constants";
import { useBuddyLook } from "@/lib/buddy/useBuddyLook";
import { useBuddyMood } from "@/lib/buddy/useBuddyMood";
import { ROUTES } from "@/constants/routes";

import { runLoop } from "../runLoop";
import { IRunnerStage, poseOf, RUNNER_W } from "../script";

import { useBuddyAlive } from "./useBuddyAlive";

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

	const isStill = stage === "stop" || stage === "react" || stage === "look";
	const alive = useBuddyAlive({
		x,
		dir,
		isStill,
		onOpen: () => {
			router.push(ROUTES.BUDDY);
		},
	});
	const moveStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

	return {
		isVisible: !isReduced,
		width,
		dir,
		look,
		pose: alive.decorate(poseOf(stage, mood, reaction)),
		life,
		// "+1" subindo em cima dele quando comemora a corrida do dia
		hasPoint: stage === "react" && reaction === "celebrate",
		moveStyle,
		trackRef: alive.trackRef,
		onTrackLayout: alive.onTrackLayout,
		// Tocar: ele faz um gesto e depois abre "Seu Buddy"
		open: alive.tap,
	};
};
