import { SharedValue, useAnimatedStyle } from "react-native-reanimated";

import { ORBIT } from "../constants";
import { clamp01, easeInCubic, easeOutCubic, lerp } from "../utils/orbitMath";

// Anéis de vidro atrás das fotos: abrem com a órbita e fecham no final.
export const useOrbitRingStyle = (time: SharedValue<number>): ReturnType<typeof useAnimatedStyle> =>
	useAnimatedStyle(() => {
		const t = time.value;
		const out = easeInCubic(clamp01((t - ORBIT.outAt) / ORBIT.outDuration));
		const ring = easeOutCubic(clamp01((t - 0.9) / 1)) * (1 - out);

		return { opacity: ring, transform: [{ scale: lerp(0.7, 1, ring) }] };
	});
