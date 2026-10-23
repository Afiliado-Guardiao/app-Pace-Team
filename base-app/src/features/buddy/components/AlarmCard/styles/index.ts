import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

export const createAlarmCardStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;

	return {
		section: { gap: 10 } as ViewStyle,
		card: { gap: 14 } as ViewStyle,
		time: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			gap: 6,
		} as ViewStyle,
		unit: { flexDirection: "row", alignItems: "center" } as ViewStyle,
		stepBtn: {
			width: 30,
			height: 34,
			borderRadius: 15,
			alignItems: "center",
			justifyContent: "center",
		} as ViewStyle,
		digits: {
			minWidth: 44,
			textAlign: "center",
			fontFamily: typography.fonts.bold,
			fontSize: 30,
			color: colors.textPrimary,
			fontVariant: ["tabular-nums"],
		} as TextStyle,
		colon: {
			fontFamily: typography.fonts.bold,
			fontSize: 30,
			color: colors.textSecondary,
		} as TextStyle,
		days: { flexDirection: "row", justifyContent: "space-between", gap: 6 } as ViewStyle,
		hint: {
			fontFamily: typography.fonts.medium,
			fontSize: 11.5,
			lineHeight: 16.7,
			color: colors.textTertiary,
		} as TextStyle,
	};
};
