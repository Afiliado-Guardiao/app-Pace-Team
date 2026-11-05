import { SkPicture } from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

import { emptyPicture } from "../scene/emptyPicture";
import { frontPicture, IBuddyKit } from "../scene/frontPicture";
import { scenePicture } from "../scene/scenePicture";
import { IHeroFrame, ISceneKit } from "../scene/types";

interface IUseScenePicturesOptions {
	kit: ISceneKit | null;
	buddy: IBuddyKit | null;
	frame: IHeroFrame;
	clock: SharedValue<number>;
	still: SharedValue<number>;
	jump: SharedValue<number>;
}

interface IUseScenePicturesReturn {
	scene: SharedValue<SkPicture>;
	front: SharedValue<SkPicture>;
}

// Quadros da pista (corredores sempre correm) e da frente (chuva/névoa só
// se mexem quando o clima pede; sem isso só redesenha no pulinho do Buddy)
export const useScenePictures = (o: IUseScenePicturesOptions): IUseScenePicturesReturn => {
	const { kit, buddy, frame, jump } = o;
	const sceneClock = o.clock;
	const hasWeatherMotion = !!kit && (kit.weather.rain > 0 || kit.weather.preset === "cold");
	const frontClock = hasWeatherMotion ? o.clock : o.still;

	const scene = useDerivedValue(() => (kit ? scenePicture(kit, sceneClock.value) : emptyPicture()));
	const front = useDerivedValue(() =>
		kit && buddy
			? frontPicture({ kit, frame, buddy }, frontClock.value, jump.value)
			: emptyPicture(),
	);
	return { scene, front };
};
