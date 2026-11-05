import { SkPicture } from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

import { IWeather } from "@/lib/weather";

import { skyIsAnimated, skyPicture } from "../scene/skyPicture";
import { IHeroFrame } from "../scene/types";

// Quadro do céu (sol que respira, estrelas que piscam)
export const useSkyPicture = (o: {
	frame: IHeroFrame;
	weather: IWeather;
	clocks: { clock: SharedValue<number>; still: SharedValue<number> };
}): SharedValue<SkPicture> => {
	const { frame, weather } = o;
	const clock = skyIsAnimated(weather) ? o.clocks.clock : o.clocks.still;
	return useDerivedValue(() => skyPicture({ frame, weather }, clock.value));
};
