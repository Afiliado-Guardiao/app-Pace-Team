import { SharedValue, useAnimatedStyle } from "react-native-reanimated";

import { ORBIT } from "../constants";
import { clamp01, easeOutCubic, lerp } from "../utils/orbitMath";

const RISE = 16;

// Frase da órbita: sobe e aparece depois do ícone, some antes do final.
export const useOrbitCaptionStyle = (
	time: SharedValue<number>,
): ReturnType<typeof useAnimatedStyle> =>
	useAnimatedStyle(() => {
		const t = time.value;
		const shown =
			easeOutCubic(clamp01((t - ORBIT.textAt) / 0.7)) * (1 - clamp01((t - ORBIT.outAt) / 0.4));

		return { opacity: shown, transform: [{ translateY: lerp(RISE, 0, shown) }] };
	});
