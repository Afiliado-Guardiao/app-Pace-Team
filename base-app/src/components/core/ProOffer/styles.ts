import { ITheme } from "@/theme";

const BODY_MAX = 0.58;
const RADIO = 20;

// Estilos da janela do Team Pro (corpo rolável, planos e rodapé da Apple)
export const createProOfferStyles = (theme: ITheme, screenHeight: number) => {
	const { colors, spacing, typography, radii } = theme.pace;
	const small = {
		fontFamily: typography.fonts.medium,
		fontSize: typography.sizes.xs,
		lineHeight: typography.sizes.xs * 1.45,
		color: colors.textSecondary,
	};
	return {
		scroll: { maxHeight: screenHeight * BODY_MAX },
		body: { gap: spacing[3], paddingBottom: spacing[2] },
		badge: {
			alignSelf: "flex-start" as const,
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: spacing[2],
			paddingHorizontal: spacing[3],
			paddingVertical: spacing[1],
			borderRadius: radii.pill,
			backgroundColor: colors.accentSoft,
			borderWidth: 1,
			borderColor: colors.accentBorderSoft,
		},
		badgeText: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.micro,
			letterSpacing: 1.2,
			color: colors.textPrimary,
		},
		lead: { ...small, fontSize: typography.sizes.sm, color: colors.textPrimary },
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.xl,
			color: colors.textPrimary,
		},
		sub: small,
		row: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[2] },
		benefit: { ...small, flex: 1, color: colors.textPrimary },
		fair: { ...small, color: colors.textTertiary },
		plan: (isSelected: boolean) => ({
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: spacing[3],
			padding: spacing[3],
			borderRadius: radii.lg,
			borderWidth: isSelected ? 2 : 1,
			borderColor: isSelected ? colors.orange[500] : colors.glassBorder,
			backgroundColor: colors.glass1,
		}),
		radio: (isSelected: boolean) => ({
			width: RADIO,
			height: RADIO,
			borderRadius: RADIO / 2,
			borderWidth: isSelected ? 6 : 2,
			borderColor: isSelected ? colors.orange[500] : colors.glassBorderStrong,
		}),
		planBody: { flex: 1, gap: 2 },
		planTitle: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		},
		planSub: small,
		price: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.lg,
			color: colors.textPrimary,
		},
		unit: { ...small, fontFamily: typography.fonts.semibold },
		saveBadge: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.micro,
			color: colors.orange[300],
		},
		legal: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.micro,
			lineHeight: typography.sizes.micro * 1.5,
			color: colors.textTertiary,
		},
		links: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: spacing[4] },
		link: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.orange[400],
		},
		icon: colors.orange[400],
		gold: colors.statusWarning,
	};
};

export type IProOfferStyles = ReturnType<typeof createProOfferStyles>;
