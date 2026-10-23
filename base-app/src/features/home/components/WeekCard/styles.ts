import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

const ICON_DOT = 40;
const GAUGE_TOP = 14;
const GAUGE_BOTTOM = 6;

export const createWeekCardStyles = (theme: ITheme) => {
	const { borders, colors, spacing, typography } = theme.pace;
	const { fonts, sizes, lineHeights } = typography;

	return {
		header: { flexDirection: "row", alignItems: "center", gap: spacing[3] } as ViewStyle,
		iconDot: {
			width: ICON_DOT,
			height: ICON_DOT,
			borderRadius: ICON_DOT / 2,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: colors.iconDotSoft,
			borderWidth: borders.hairline,
			borderColor: colors.iconDotBorder,
		} as ViewStyle,
		title: {
			fontFamily: fonts.bold,
			fontSize: sizes.md,
			lineHeight: sizes.md * lineHeights.snug,
			color: colors.textPrimary,
		} as TextStyle,
		subtitle: {
			fontFamily: fonts.medium,
			fontSize: sizes.sm,
			lineHeight: sizes.sm * lineHeights.caption,
			color: colors.textSecondary,
		} as TextStyle,
		gauge: { alignItems: "center", marginTop: GAUGE_TOP, marginBottom: GAUGE_BOTTOM } as ViewStyle,
		tiles: { flexDirection: "row", gap: spacing[2.5] } as ViewStyle,
	};
};
