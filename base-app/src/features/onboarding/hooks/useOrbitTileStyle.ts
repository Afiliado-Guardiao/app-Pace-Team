import { SharedValue, useAnimatedStyle } from "react-native-reanimated";

import { ORBIT } from "../constants";
import { clamp01, easeInCubic, easeOutCubic, lerp } from "../utils/orbitMath";

const DEG = Math.PI / 180;
const SLOT_DEG = 45;
const START_RADIUS = 560;
const START_SCALE = 2.8;
const END_SCALE = 0.25;
const START_TILT = -18;
const START_ANGLE = -80;

// Foto da galera: chega de fora girando, orbita o ícone e é sugada no final.
export const useOrbitTileStyle = (
	time: SharedValue<number>,
	index: number,
	center: { x: number; y: number },
): ReturnType<typeof useAnimatedStyle> =>
	useAnimatedStyle(() => {
		const t = time.value;
		const p = easeOutCubic(
			clamp01((t - ORBIT.inStart - index * ORBIT.inStagger) / ORBIT.inDuration),
		);
		const out = easeInCubic(clamp01((t - ORBIT.outAt) / ORBIT.outDuration));
		const angle = (index * SLOT_DEG + t * ORBIT.spinPerSecond + lerp(START_ANGLE, 0, p)) * DEG;
		const radius = lerp(START_RADIUS, ORBIT.radius, p) * (1 - out);
		const scale = lerp(START_SCALE, 1, p) * lerp(1, END_SCALE, out);
		const opacity = clamp01(p * 4) * (1 - clamp01((out - 0.6) / 0.4));
		const half = ORBIT.tile / 2;

		return {
			opacity,
			transform: [
				{ translateX: center.x + Math.cos(angle) * radius - half },
				{ translateY: center.y + Math.sin(angle) * radius - half },
				{ scale },
				{ rotate: `${String(lerp(START_TILT, 0, p))}deg` },
			],
		};
	});
