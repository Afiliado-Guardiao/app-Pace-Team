export const typography = {
	fontFamilies: {
		regular: "Inter_400Regular",
		medium: "Inter_500Medium",
		semibold: "Inter_600SemiBold",
		bold: "Inter_700Bold",
	},

	// Escala modular: 12 / 14 / 16 / 18 / 20 / 24 / 32 / 40
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

	// 1.2 para títulos, 1.5 para corpo
	lineHeights: {
		tight: 1.2,
		normal: 1.5,
		relaxed: 1.75,
	},

	// Negativa em títulos grandes para aparência mais polida
	letterSpacing: {
		tighter: -0.5,
		tight: -0.25,
		normal: 0,
		wide: 0.25,
	},
} as const;

export type ITypography = typeof typography;
