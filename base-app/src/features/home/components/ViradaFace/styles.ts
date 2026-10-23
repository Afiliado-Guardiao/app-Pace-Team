import { TextStyle, ViewStyle } from "react-native";

import { IGlassAppearance } from "@/components/pace";
import { ITheme } from "@/theme";
import { IViradaTone } from "@/lib/pace";

const BIG = 38;
const DOT = 10;
const POSITION_BOTTOM = 4;

// Cor da disputa: âmbar (equilibrada), laranja (ultrapassando), verde (virada)
export const viradaToneColor = (theme: ITheme, tone: IViradaTone): string => {
	const { colors } = theme.pace;
	const map: Record<IViradaTone, string> = {
		warning: colors.statusWarning,
		accent: colors.orange[400],
		success: colors.statusSuccess,
	};
	return map[tone];
};

export const createViradaFaceStyles = (theme: ITheme, tone: IViradaTone, height: number) => {
	const { blur, colors, shadows, spacing, typography } = theme.pace;
	const { fonts, sizes, lineHeights } = typography;

	return {
		card: { height, padding: spacing.cardPad, justifyContent: "space-between" } as ViewStyle,
		appearance: {
			fill: "glassFill",
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
			outerShadow: shadows.glassOuter,
			innerShadow: shadows.glassInner,
		} as IGlassAppearance,
		header: { flexDirection: "row", alignItems: "center", gap: spacing[3] } as ViewStyle,
		texts: { flex: 1, minWidth: 0 } as ViewStyle,
		title: {
			fontFamily: fonts.bold,
			fontSize: sizes.md,
			lineHeight: sizes.md * lineHeights.snug,
			color: colors.textPrimary,
		} as TextStyle,
		sub: {
			fontFamily: fonts.medium,
			fontSize: sizes.sm,
			lineHeight: sizes.sm * lineHeights.caption,
			color: colors.textSecondary,
		} as TextStyle,
		freshDot: {
			width: DOT,
			height: DOT,
			borderRadius: DOT / 2,
			backgroundColor: colors.orange[500],
			boxShadow: shadows.freshDot,
		} as ViewStyle,
		bottomRow: {
			flexDirection: "row",
			alignItems: "flex-end",
			justifyContent: "space-between",
			gap: spacing[2.5],
		} as ViewStyle,
		diff: {
			fontFamily: fonts.bold,
			fontSize: BIG,
			fontVariant: [...typography.tabularNums],
			color: viradaToneColor(theme, tone),
		} as TextStyle,
		diffUnit: {
			fontFamily: fonts.medium,
			fontSize: sizes.ui,
			color: colors.textSecondary,
		} as TextStyle,
		position: {
			paddingBottom: POSITION_BOTTOM,
			textAlign: "right",
			fontFamily: fonts.semibold,
			fontSize: sizes.label,
			color: colors.textSecondary,
		} as TextStyle,
		bar: { marginTop: spacing[3] } as ViewStyle,
	};
};
