import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

const CELL = "14.2857%";

export const createDayGridStyles = (theme: ITheme) => {
	const { colors, typography, spacing, radii } = theme.pace;
	return {
		grid: { flexDirection: "row", flexWrap: "wrap", rowGap: spacing[1] } as ViewStyle,
		week: {
			width: CELL,
			textAlign: "center",
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.micro,
			color: colors.textTertiary,
			paddingBottom: spacing[1],
		} as TextStyle,
		cell: { width: CELL, aspectRatio: 1, padding: 2 } as ViewStyle,
		box: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
			borderRadius: radii.sm,
			borderWidth: 1,
			borderColor: colors.transparent,
		} as ViewStyle,
		hasRuns: { backgroundColor: colors.glass2, borderColor: colors.glassBorder } as ViewStyle,
		today: { borderColor: colors.textSecondary } as ViewStyle,
		picked: { backgroundColor: colors.accent, borderColor: colors.accent } as ViewStyle,
		num: {
			fontFamily: typography.numericFonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.textDisabled,
		} as TextStyle,
		numRuns: { color: colors.textPrimary } as TextStyle,
		numPicked: { color: colors.onAccent } as TextStyle,
		dot: {
			position: "absolute",
			bottom: 4,
			width: 4,
			height: 4,
			borderRadius: 2,
			backgroundColor: colors.accent,
		} as ViewStyle,
		dotPicked: { backgroundColor: colors.onAccent } as ViewStyle,
	};
};
