import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { IGlassAppearance } from "../../primitives";

const HEIGHT = 36;

export const createGlassPillStyles = (
	theme: ITheme,
): { pill: ViewStyle; text: TextStyle; appearance: IGlassAppearance } => {
	const { blur, colors, spacing, typography } = theme.pace;

	return {
		pill: {
			alignSelf: "flex-start",
			flexDirection: "row",
			alignItems: "center",
			gap: spacing[2],
			height: HEIGHT,
			paddingHorizontal: spacing[3.5],
		},
		text: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.label,
			color: colors.textPrimary,
		},
		appearance: {
			fill: { color: colors.surfaceTabIdle },
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
		},
	};
};
