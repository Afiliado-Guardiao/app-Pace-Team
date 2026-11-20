import { SharedValue, useAnimatedStyle } from "react-native-reanimated";

import { LENS, PANEL } from "../constants";
import { lensAt } from "../lens";

const MAX = LENS.sizes[0];

// Posição da bolinha i na lente: a bolinha tem sempre 56 px e escala até o
// tamanho da lente (ícone, borda e brilho encolhem juntos)
export const useBubbleStyle = (
	pos: SharedValue<number>,
	o: { index: number; centerX: number },
): ReturnType<typeof useAnimatedStyle> =>
	useAnimatedStyle(() => {
		const d = o.index - pos.value;
		const spot = lensAt(d);
		return {
			opacity: spot.opacity,
			zIndex: 10 - Math.round(Math.abs(d)),
			transform: [
				{ translateX: o.centerX - MAX / 2 + spot.x },
				{ translateY: PANEL.bubbleCenterY - MAX / 2 },
				{ scale: spot.size / MAX },
			],
		};
	});
