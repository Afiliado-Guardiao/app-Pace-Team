import { SharedValue, useAnimatedStyle } from "react-native-reanimated";

import { ORBIT } from "../constants";
import { clamp01, easeBack } from "../utils/orbitMath";

const PULSE = 0.14;

// Ícone do app: surge com overshoot, pulsa ao engolir as fotos e some.
export const useOrbitIconStyle = (time: SharedValue<number>): ReturnType<typeof useAnimatedStyle> =>
	useAnimatedStyle(() => {
		const t = time.value;
		const iconIn = clamp01((t - ORBIT.iconAt) / 0.7);
		const pulse = 1 + PULSE * Math.sin(Math.PI * clamp01((t - ORBIT.outAt - 0.35) / 0.6));
		const scale = (iconIn > 0 ? easeBack(iconIn) : 0) * pulse;

		return {
			opacity: 1 - clamp01((t - ORBIT.outAt - 0.6) / 0.35),
			transform: [{ scale }],
		};
	});
