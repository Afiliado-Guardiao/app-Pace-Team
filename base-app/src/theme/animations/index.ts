import { Easing } from "react-native-reanimated";

export const animations = {
	durations: {
		fast: 150,
		normal: 250,
		slow: 400,
	},

	easings: {
		// ease-out para entradas (começa rápido, desacelera)
		enter: Easing.out(Easing.cubic),
		// ease-in para saídas (começa devagar, acelera)
		exit: Easing.in(Easing.cubic),
		// ease-in-out para transições de estado
		inOut: Easing.inOut(Easing.cubic),
	},
} as const;

export type IAnimations = typeof animations;
