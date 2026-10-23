// PACE TEAM — desfoque do vidro (backdrop-filter do design system).
// O CSS usa blur(28px) saturate(180%). O expo-blur mede por "intensity"
// (0–100); na web ele aplica exatamente saturate(180%) blur(intensity × 0,2px),
// então 100 = 20px, o máximo disponível. No iOS o desfoque é nativo
// (UIVisualEffectView) e a aparência final deve ser conferida no aparelho.

export const paceBlur = {
	tint: "systemUltraThinMaterialDark",

	intensity: {
		glass: 100, // blur(28px) saturate(180%)
		sheet: 100, // blur(40px) saturate(160%)
		toast: 100, // blur(30px) saturate(160%)
		tooltip: 100, // blur(20px)
		scrim: 30, // blur(6px)
	},
} as const;

export type IPaceBlur = typeof paceBlur;
