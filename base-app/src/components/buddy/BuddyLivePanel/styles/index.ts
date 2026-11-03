import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

interface IBuddyLivePanelStyles {
	backdrop: ViewStyle;
	sheet: ViewStyle;
	figure: ViewStyle;
	title: TextStyle;
	subtitle: TextStyle;
	row: ViewStyle;
	action: ViewStyle;
	goal: ViewStyle;
	goalValue: TextStyle;
}

export const createBuddyLivePanelStyles = (
	theme: ITheme,
	bottom: number,
): IBuddyLivePanelStyles => {
	const { colors, spacing, typography } = theme.pace;
	return {
		backdrop: {
			flex: 1,
			justifyContent: "flex-end",
			backgroundColor: colors.surfaceScrim,
			paddingHorizontal: spacing[4],
			paddingBottom: bottom + spacing[4],
		},
		sheet: { gap: spacing[3], alignItems: "center" },
		figure: { width: 140, height: 135, marginTop: -spacing[2] },
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.h3,
			color: colors.textPrimary,
			textAlign: "center",
		},
		subtitle: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
			textAlign: "center",
		},
		row: { flexDirection: "row", gap: spacing[2], alignSelf: "stretch" },
		action: { flex: 1 },
		goal: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			gap: spacing[2],
			alignSelf: "stretch",
		},
		goalValue: {
			minWidth: 72,
			textAlign: "center",
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.h3,
			color: colors.textPrimary,
		},
	};
};
