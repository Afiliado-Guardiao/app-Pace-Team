import { TextStyle, ViewStyle } from "react-native";

import { IGlassAppearance } from "@/components/pace";
import { ITheme } from "@/theme";

const ICON_DOT = 36;
const VALUE_SIZE = 24;

export const createInnerTileStyles = (theme: ITheme) => {
	const { borders, colors, shadows, spacing, typography } = theme.pace;
	const { fonts, sizes, lineHeights } = typography;

	return {
		pressable: { flex: 1, minWidth: 0 } as ViewStyle,
		tile: { padding: spacing[3.5], gap: spacing[4.5] } as ViewStyle,
		appearance: {
			fill: { color: colors.innerTile },
			border: colors.innerTileBorder,
			rim: true,
			innerShadow: shadows.innerHighlight,
		} as IGlassAppearance,
		header: { flexDirection: "row", alignItems: "center", gap: spacing[2.5] } as ViewStyle,
		iconDot: {
			width: ICON_DOT,
			height: ICON_DOT,
			flexShrink: 0,
			borderRadius: ICON_DOT / 2,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: colors.iconDotSoft,
			borderWidth: borders.hairline,
			borderColor: colors.iconDotBorder,
		} as ViewStyle,
		label: {
			fontFamily: fonts.medium,
			fontSize: sizes.sm,
			lineHeight: sizes.sm * lineHeights.row,
			color: colors.textPrimary,
		} as TextStyle,
		value: {
			fontFamily: fonts.bold,
			fontSize: VALUE_SIZE,
			fontVariant: [...typography.tabularNums],
			color: colors.textPrimary,
		} as TextStyle,
		unit: {
			fontFamily: fonts.medium,
			fontSize: sizes.label,
			color: colors.textSecondary,
		} as TextStyle,
	};
};
