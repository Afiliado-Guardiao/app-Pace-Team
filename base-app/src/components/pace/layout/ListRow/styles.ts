import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { IGlassAppearance } from "../../primitives";

const ICON_DOT = 40;
const SUB_GAP = 3;

interface IListRowStyles {
	row: ViewStyle;
	iconDot: ViewStyle;
	texts: ViewStyle;
	title: TextStyle;
	sub: TextStyle;
	appearance: IGlassAppearance;
	iconColor: string;
}

export const createListRowStyles = (theme: ITheme, isAccent: boolean): IListRowStyles => {
	const { blur, borders, colors, shadows, spacing, typography } = theme.pace;
	const { fonts, sizes, lineHeights } = typography;

	return {
		row: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacing[3],
			paddingVertical: spacing[3],
			paddingHorizontal: spacing[3.5],
		},
		iconDot: {
			width: ICON_DOT,
			height: ICON_DOT,
			flexShrink: 0,
			borderRadius: ICON_DOT / 2,
			alignItems: "center",
			justifyContent: "center",
			borderWidth: borders.hairline,
			borderColor: colors.glassBorder,
			backgroundColor: isAccent ? colors.accentSoft : colors.glass2,
		},
		texts: { flex: 1, minWidth: 0 },
		title: {
			fontFamily: fonts.semibold,
			fontSize: sizes.ui,
			lineHeight: sizes.ui * lineHeights.row,
			color: colors.textPrimary,
		},
		sub: {
			marginTop: SUB_GAP,
			fontFamily: fonts.medium,
			fontSize: sizes.label,
			lineHeight: sizes.label * lineHeights.caption,
			color: colors.textTertiary,
		},
		appearance: {
			fill: "glassFill",
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
			innerShadow: shadows.innerHighlight,
		},
		iconColor: isAccent ? colors.orange[400] : colors.textPrimary,
	};
};
