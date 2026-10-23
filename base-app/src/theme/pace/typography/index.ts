// PACE TEAM — tipografia (tokens/typography.css).
// Montserrat em tudo (títulos 800, métricas 600–700 tabulares, UI 500–700).
// Exo 2 só como fonte de marca, em momentos raros que ecoam o logo.

export const paceTypography = {
	fonts: {
		light: "Montserrat_300Light",
		regular: "Montserrat_400Regular",
		medium: "Montserrat_500Medium",
		semibold: "Montserrat_600SemiBold",
		bold: "Montserrat_700Bold",
		extrabold: "Montserrat_800ExtraBold",
	},

	brandFonts: {
		regular: "Exo2_400Regular",
		semibold: "Exo2_600SemiBold",
		bold: "Exo2_700Bold",
		extrabold: "Exo2_800ExtraBold",
		black: "Exo2_900Black",
	},

	// --fs-* do design system + tamanhos usados pelos componentes
	sizes: {
		tabLabel: 8.5,
		"2xs": 9,
		micro: 10,
		xs: 11,
		label: 12,
		sm: 13,
		ui: 14,
		body: 15,
		md: 16,
		lg: 17,
		h3: 18,
		xl: 20,
		h2: 22,
		h1: 28,
		podium: 30,
		display: 34,
		jumbo: 40,
		hero: 44,
		metricSm: 20,
		metricMd: 28,
		metricLg: 44,
		metricXl: 64,
	},

	// Multiplicadores (CSS unitless). Multiplicar pelo fontSize.
	lineHeights: {
		tight: 1.05,
		snug: 1.2,
		row: 1.25,
		caption: 1.3,
		toast: 1.35,
		body: 1.45,
	},

	// Em "em" (CSS). Multiplicar pelo fontSize.
	tracking: {
		wide: 0.22,
		label: 0.14,
		tag: 0.08,
		badge: 0.04,
		input: 0.02,
		button: 0.01,
		tight: -0.01,
	},

	tabularNums: ["tabular-nums"] as const,
} as const;

export type IPaceTypography = typeof paceTypography;
