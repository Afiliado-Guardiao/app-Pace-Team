import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

export const createShortcutGuideStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;

	return {
		section: { gap: 10 } as ViewStyle,
		card: { gap: 12 } as ViewStyle,
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 16,
			lineHeight: 19.2,
			color: colors.textPrimary,
		} as TextStyle,
		body: {
			fontFamily: typography.fonts.medium,
			fontSize: 12.5,
			lineHeight: 17.5,
			color: colors.textSecondary,
		} as TextStyle,
		step: { flexDirection: "row", alignItems: "center", gap: 10 } as ViewStyle,
		number: {
			width: 22,
			height: 22,
			borderRadius: 11,
			backgroundColor: colors.accentSoft,
			borderWidth: 1,
			borderColor: colors.accent,
			alignItems: "center",
			justifyContent: "center",
		} as ViewStyle,
		numberText: {
			fontFamily: typography.fonts.bold,
			fontSize: 11,
			color: colors.orange[300],
		} as TextStyle,
		stepText: {
			flex: 1,
			fontFamily: typography.fonts.semibold,
			fontSize: 12.5,
			lineHeight: 16.25,
			color: colors.textPrimary,
		} as TextStyle,
		actions: { gap: 8, marginTop: 2 } as ViewStyle,
		ok: {
			fontFamily: typography.fonts.semibold,
			fontSize: 12,
			lineHeight: 16,
			color: colors.statusSuccess,
		} as TextStyle,
		note: {
			fontFamily: typography.fonts.medium,
			fontSize: 11.5,
			lineHeight: 16.7,
			color: colors.textTertiary,
		} as TextStyle,
	};
};
