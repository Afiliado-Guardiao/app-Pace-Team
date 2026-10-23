// Cores, glifos e posições dos efeitos do Buddy (design: 140 × 135)
export const STAR = "50,0 61,39 100,50 61,61 50,100 39,61 0,50 39,39";
export const ORANGE = "#FF7A2E";
export const GLYPH = {
	position: "absolute",
	fontWeight: "800",
	color: ORANGE,
	textShadowColor: "rgba(253,90,12,.8)",
	textShadowRadius: 12,
} as const;

export type ISpark = readonly [number, number, number];

export const IMPRESSED: readonly ISpark[] = [
	[4, 14, 12],
	[100, 4, 10],
	[128, 60, 9],
];
export const CELEBRATE: readonly ISpark[] = [
	[6, 18, 14],
	[118, 6, 16],
	[126, 74, 12],
	[2, 90, 12],
	[62, -6, 10],
];
export const GOLD: readonly ISpark[] = [
	[12, 28, 12],
	[116, 18, 9],
	[124, 88, 10],
	[2, 84, 8],
	[70, 4, 8],
];
export const METAL: readonly ISpark[] = [
	[16, 30, 10],
	[116, 22, 8],
	[122, 90, 9],
];
