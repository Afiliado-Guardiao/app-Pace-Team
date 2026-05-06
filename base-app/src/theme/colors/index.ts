// Paleta primitiva
const palette = {
	black: "#000000",
	ink: "#111111",
	graphite: "#333333",
	stone: "#555555",
	silver: "#888888",
	mist: "#BBBBBB",
	cloud: "#E5E5E5",
	snow: "#F7F7F7",
	white: "#FFFFFF",
} as const;

// Estados/feedback
const status = {
	success: "#0A7D32",
	danger: "#B00020",
	warning: "#B25E00",
} as const;

// Semânticos — único ponto de verdade para cores da UI
export const colors = {
	// Primitivos expostos (para referência direta quando necessário)
	...palette,

	// Texto
	text: palette.ink,
	textSecondary: palette.stone,
	textMuted: palette.silver,
	textInverse: palette.white,

	// Superfície
	background: palette.white,
	surface: palette.snow,
	surfaceElevated: palette.white,

	// Borda
	border: palette.cloud,
	borderStrong: palette.mist,

	// Interativo primário (botão principal, links, destaque)
	primary: palette.black,
	primaryForeground: palette.white,

	// Estados
	success: status.success,
	danger: status.danger,
	warning: status.warning,

	// Overlay
	overlay: "rgba(0, 0, 0, 0.4)",
} as const;

export type IColors = typeof colors;
