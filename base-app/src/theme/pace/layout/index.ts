// PACE TEAM — espaçamento, raios e medidas de layout (tokens/spacing.css).

export const paceSpacing = {
	0: 0,
	0.5: 2,
	1: 4,
	1.5: 6,
	2: 8,
	2.5: 10,
	3: 12,
	3.5: 14,
	4: 16,
	4.5: 18,
	5: 20,
	6: 24,
	8: 32,
	10: 40,
	12: 48,
	16: 64,

	// Semânticos
	screenGutter: 20,
	cardPad: 18,
	stackGap: 14,
} as const;

export const paceRadii = {
	tag: 6,
	checkbox: 7,
	xs: 8,
	sm: 12,
	md: 18,
	rowSm: 20,
	row: 22,
	lg: 24,
	xl: 30,
	sheet: 32,
	hero: 34,
	"2xl": 36,
	device: 48,
	pill: 999,
} as const;

export const paceLayout = {
	tabBarHeight: 84,
	topBarHeight: 56,
	hitMin: 44,
	railPaddingRight: 68,
} as const;

export const paceBorders = {
	hairline: 1,
	rim: 1.2,
	control: 1.5,
} as const;

export type IPaceSpacing = typeof paceSpacing;
export type IPaceRadii = typeof paceRadii;
export type IPaceLayout = typeof paceLayout;
export type IPaceBorders = typeof paceBorders;
