import { SkPicture } from "@shopify/react-native-skia";
import { SharedValue } from "react-native-reanimated";

import { IWeekHero } from "../../../hooks/useWeekHero";
import { IWeekSummary } from "../../../hooks/useWeekSummary";
import { heroScale } from "../layout";

import { useHeroKit } from "./useHeroKit";
import { useScenePictures } from "./useScenePictures";
import { useTickArc } from "./useTickArc";

interface IUseWeekHeroSceneReturn {
	arc: SharedValue<SkPicture>;
	scene: SharedValue<SkPicture>;
	front: SharedValue<SkPicture>;
	k: number;
	ks: number;
}

// Quadros do bloco: medidor, pista com corredores e a camada da frente
export const useWeekHeroScene = (hero: IWeekHero, week: IWeekSummary): IUseWeekHeroSceneReturn => {
	const { width, frame } = hero.layout;
	const { k, ks } = heroScale(width);
	const { kit, buddy } = useHeroKit({
		weather: hero.weather.weather,
		runners: hero.online.runners,
		width,
	});
	const arc = useTickArc({ km: week.km, goal: week.goal, k });
	const { scene, front } = useScenePictures({
		kit,
		buddy,
		frame,
		clock: hero.clocks.clock,
		still: hero.clocks.still,
		jump: hero.jump,
	});
	return { arc, scene, front, k, ks };
};
