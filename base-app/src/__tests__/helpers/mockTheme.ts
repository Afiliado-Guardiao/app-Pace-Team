import { Platform } from "react-native";

const iosShadow = (
	height: number,
	opacity: number,
	radius: number,
): Record<string, unknown> => ({
	shadowColor: "#000000",
	shadowOffset: { width: 0, height },
	shadowOpacity: opacity,
	shadowRadius: radius,
});

const androidShadow = (elevation: number): Record<string, unknown> => ({
	elevation,
});

export const mockTheme = {
	colors: {
		black: "#000000",
		ink: "#111111",
		graphite: "#333333",
		stone: "#555555",
		silver: "#888888",
		mist: "#BBBBBB",
		cloud: "#E5E5E5",
		snow: "#F7F7F7",
		white: "#FFFFFF",
		text: "#111111",
		textSecondary: "#555555",
		textMuted: "#888888",
		textInverse: "#FFFFFF",
		background: "#FFFFFF",
		surface: "#F7F7F7",
		surfaceElevated: "#FFFFFF",
		border: "#E5E5E5",
		borderStrong: "#BBBBBB",
		primary: "#000000",
		primaryForeground: "#FFFFFF",
		success: "#0A7D32",
		danger: "#B00020",
		warning: "#B25E00",
		overlay: "rgba(0, 0, 0, 0.4)",
	},
	typography: {
		fontFamilies: {
			regular: "Inter_400Regular",
			medium: "Inter_500Medium",
			semibold: "Inter_600SemiBold",
			bold: "Inter_700Bold",
		},
		sizes: {
			xs: 12,
			sm: 14,
			base: 16,
			lg: 18,
			xl: 20,
			"2xl": 24,
			"3xl": 32,
			"4xl": 40,
		},
		weights: {
			regular: "400" as const,
			medium: "500" as const,
			semibold: "600" as const,
			bold: "700" as const,
		},
		lineHeights: {
			tight: 1.2,
			normal: 1.5,
			relaxed: 1.75,
		},
		letterSpacing: {
			tighter: -0.5,
			tight: -0.25,
			normal: 0,
			wide: 0.25,
		},
	},
	spacing: {
		1: 4,
		2: 8,
		3: 12,
		4: 16,
		5: 20,
		6: 24,
		8: 32,
		10: 40,
		12: 48,
		16: 64,
		xs: 4,
		sm: 8,
		md: 16,
		lg: 24,
		xl: 32,
		"2xl": 48,
		"3xl": 64,
	},
	borderRadius: {
		none: 0,
		sm: 4,
		md: 8,
		lg: 12,
		xl: 16,
		full: 9999,
	},
	borderWidth: {
		none: 0,
		hairline: 1,
		medium: 2,
	},
	componentSizes: {
		button: {
			sm: 36,
			md: 48,
			lg: 56,
		},
		input: {
			default: 48,
		},
		icon: {
			sm: 16,
			md: 20,
			lg: 24,
			xl: 32,
		},
		tabBar: {
			height: 56,
			iconSize: 24,
			paddingBottom: 8,
		},
		header: {
			height: 56,
		},
		modal: {
			maxWidth: 360,
		},
		safeArea: {
			topOffset: 56,
			bottomOffset: 34,
		},
	},
	shadows: {
		none: Platform.select({
			ios: iosShadow(0, 0, 0),
			android: androidShadow(0),
			default: {},
		}) as Record<string, unknown>,
		low: Platform.select({
			ios: iosShadow(1, 0.06, 2),
			android: androidShadow(1),
			default: {},
		}) as Record<string, unknown>,
		mid: Platform.select({
			ios: iosShadow(2, 0.08, 4),
			android: androidShadow(2),
			default: {},
		}) as Record<string, unknown>,
		high: Platform.select({
			ios: iosShadow(4, 0.1, 8),
			android: androidShadow(4),
			default: {},
		}) as Record<string, unknown>,
	},
	animations: {
		durations: {
			fast: 150,
			normal: 250,
			slow: 400,
		},
		easings: {
			enter: undefined,
			exit: undefined,
			inOut: undefined,
		},
	},
};
