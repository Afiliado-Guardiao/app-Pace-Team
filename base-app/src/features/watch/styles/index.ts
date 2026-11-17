import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

export interface IWatchStyles {
	root: ViewStyle;
	body: ViewStyle;
	hero: ViewStyle;
	heroIcon: ViewStyle;
	heroTitle: TextStyle;
	text: TextStyle;
	actions: ViewStyle;
	notes: ViewStyle;
}

export const createWatchStyles = (theme: ITheme): IWatchStyles => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { flex: 1 },
		body: { gap: spacing[4] },
		hero: { gap: spacing[2] },
		heroIcon: {
			width: 52,
			height: 52,
			borderRadius: 26,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: colors.orange[500],
			marginBottom: spacing[1],
		},
		heroTitle: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.h3,
			color: colors.textPrimary,
		},
		text: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			lineHeight: typography.sizes.ui * 1.45,
			color: colors.textSecondary,
		},
		actions: { gap: spacing[2] },
		notes: { gap: spacing[3] },
	};
};
