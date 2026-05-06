// Raios contidos — minimalismo evita bordas muito arredondadas
export const borderRadius = {
	none: 0,
	sm: 4,
	md: 8,
	lg: 12,
	xl: 16,
	full: 9999,
} as const;

export type IBorderRadius = typeof borderRadius;
