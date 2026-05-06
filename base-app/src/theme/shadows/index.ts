import { Platform } from "react-native";

// Sombras minimalistas — muito leves, sem elevação pesada
const iosShadow = (height: number, opacity: number, radius: number): Record<string, unknown> => ({
	shadowColor: "#000000",
	shadowOffset: { width: 0, height },
	shadowOpacity: opacity,
	shadowRadius: radius,
});

const androidShadow = (elevation: number): Record<string, unknown> => ({
	elevation,
});

export const shadows = {
	none: Platform.select({
		ios: iosShadow(0, 0, 0),
		android: androidShadow(0),
		default: {},
	}),

	low: Platform.select({
		ios: iosShadow(1, 0.06, 2),
		android: androidShadow(1),
		default: {},
	}),

	mid: Platform.select({
		ios: iosShadow(2, 0.08, 4),
		android: androidShadow(2),
		default: {},
	}),

	high: Platform.select({
		ios: iosShadow(4, 0.1, 8),
		android: androidShadow(4),
		default: {},
	}),
} as const;

export type IShadows = typeof shadows;
