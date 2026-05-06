// Escala 4-based com nomes numéricos e semânticos
export const spacing = {
	// Numéricos
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

	// Semânticos
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	"2xl": 48,
	"3xl": 64,
} as const;

export type ISpacing = typeof spacing;
