import { useCallback, useState } from "react";

import { useFocusEffect } from "expo-router";

import { SkPicture } from "@shopify/react-native-skia";
import { SharedValue, useAnimatedStyle } from "react-native-reanimated";

import { IWeekHero } from "../../../hooks/useWeekHero";
import { IWeekSummary } from "../../../hooks/useWeekSummary";
import { heroScale } from "../layout";

import { useHeroKit } from "./useHeroKit";
import { useScenePictures } from "./useScenePictures";
import { useTickArc } from "./useTickArc";

const PULSE = 0.06;

interface IUseWeekHeroSceneReturn {
	arc: SharedValue<SkPicture>;
	scene: SharedValue<SkPicture>;
	front: SharedValue<SkPicture>;
	// Pulsadinha do número quando o brilho corre pelos tracinhos
	numberStyle: ReturnType<typeof useAnimatedStyle>;
	// Muda a cada volta ao Início: o número conta de novo junto com o arco
	replay: number;
	k: number;
	ks: number;
}

// Quadros do bloco: medidor, pista com corredores e a camada da frente
export const useWeekHeroScene = (hero: IWeekHero, week: IWeekSummary): IUseWeekHeroSceneReturn => {
	const { width, frame } = hero.layout;
	const { k, ks } = heroScale(width);
	const [replay, setReplay] = useState(0);
	useFocusEffect(
		useCallback(() => {
			setReplay((n) => n + 1);
		}, []),
	);
	const { kit, buddy } = useHeroKit({
		weather: hero.weather.weather,
		runners: hero.online.runners,
		width,
	});
	const { arc, shine } = useTickArc({ km: week.km, goal: week.goal, k, replay });
	const numberStyle = useAnimatedStyle(() => ({
		transform: [{ scale: 1 + PULSE * Math.sin(Math.PI * shine.value) }],
	}));
	const { scene, front } = useScenePictures({
		kit,
		buddy,
		frame,
		clock: hero.clocks.clock,
		still: hero.clocks.still,
		jump: hero.jump,
	});
	return { arc, scene, front, numberStyle, replay, k, ks };
};
