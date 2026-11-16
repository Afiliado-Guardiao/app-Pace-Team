import { ITheme } from "@/theme";

export const createTeamGameStyles = (theme: ITheme) => {
	const { colors, typography, spacing, radii } = theme.pace;
	return {
		root: { flex: 1, backgroundColor: colors.bgSunken },
		sub: {
			marginTop: -spacing[2],
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			color: colors.textTertiary,
		},
		section: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.md,
			color: colors.textPrimary,
		},
		chips: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: spacing[2] },
		chip: {
			paddingVertical: spacing[1.5],
			paddingHorizontal: spacing[3],
			borderRadius: radii.pill,
			backgroundColor: colors.glass1,
			borderWidth: 1,
			borderColor: colors.glassBorder,
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
			overflow: "hidden" as const,
		},
		note: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			lineHeight: typography.sizes.sm * 1.45,
			color: colors.textTertiary,
		},
	};
};
