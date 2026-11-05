import { TextStyle, ViewStyle } from "react-native";

import { IGlassAppearance } from "@/components/pace";
import { ITheme } from "@/theme";

const DOT = 7;

export const createHeroPillStyles = (theme: ITheme, dotColor?: string) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		appearance: {
			fill: { color: colors.glassDark },
			border: colors.glassBorder,
			rim: true,
		} as IGlassAppearance,
		pill: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacing[1.5],
			paddingHorizontal: spacing[2.5],
			paddingVertical: spacing[1.5],
		} as ViewStyle,
		dot: {
			width: DOT,
			height: DOT,
			borderRadius: DOT / 2,
			backgroundColor: dotColor,
		} as ViewStyle,
		text: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.label,
			color: colors.textPrimary,
		} as TextStyle,
	};
};
