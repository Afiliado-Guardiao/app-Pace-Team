import { BUDDY_H, BUDDY_W } from "@/components/buddy";
import { ITheme } from "@/theme";

export const BUD_SCALE = 120 / BUDDY_W;
const PHONE = { w: 92, h: 168 } as const;
export const MIC = 84;

// Estilos do 3b (cena com o Bud + texto de cada aba)
export const createStepCallStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { gap: spacing[4] },
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 26,
			color: colors.textPrimary,
			textAlign: "center" as const,
		},
		scene: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			gap: spacing[5],
			minHeight: 190,
		},
		buddyCol: { alignItems: "center" as const, gap: spacing[2], minWidth: 130 },
		buddy: { width: BUDDY_W * BUD_SCALE, height: BUDDY_H * BUD_SCALE },
		buddyInner: {
			position: "absolute" as const,
			transform: [{ scale: BUD_SCALE }],
			transformOrigin: "0% 0%",
		},
		phone: {
			width: PHONE.w,
			height: PHONE.h,
			borderRadius: 22,
			borderWidth: 1.5,
			borderColor: colors.glassBorderStrong,
			backgroundColor: colors.glass2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
		},
		mic: {
			width: MIC,
			height: MIC,
			borderRadius: MIC / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: colors.glass2,
			borderWidth: 1,
			borderColor: colors.glassBorderStrong,
		},
		micOn: { borderColor: colors.accent, boxShadow: theme.pace.shadows.glowAccentOuter },
		text: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.ui,
			lineHeight: 22,
			color: colors.textPrimary,
			textAlign: "center" as const,
		},
		hint: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
			textAlign: "center" as const,
		},
		phrases: { gap: spacing[2] },
		phrase: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[2] },
		phraseText: {
			flex: 1,
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		accent: colors.orange[400],
	};
};

export type IStepCallStyles = ReturnType<typeof createStepCallStyles>;
