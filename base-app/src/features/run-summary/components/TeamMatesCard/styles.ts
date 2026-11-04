import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

export interface ITeamMatesCardStyles {
	title: TextStyle;
	row: ViewStyle;
	divider: ViewStyle;
	body: ViewStyle;
	name: TextStyle;
	nameRow: ViewStyle;
	live: TextStyle;
	numbers: ViewStyle;
	number: TextStyle;
	label: TextStyle;
}

export const createTeamMatesCardStyles = (theme: ITheme): ITeamMatesCardStyles => {
	const { colors, spacing, typography } = theme.pace;
	const { fonts, sizes, tabularNums } = typography;
	return {
		title: {
			fontFamily: fonts.bold,
			fontSize: sizes.md,
			color: colors.textPrimary,
			marginBottom: spacing[2],
		},
		row: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacing[3],
			paddingVertical: spacing[2],
		},
		divider: { borderTopWidth: 1, borderTopColor: colors.hairline },
		body: { flex: 1, gap: spacing[1] },
		name: { fontFamily: fonts.semibold, fontSize: sizes.sm, color: colors.textPrimary },
		nameRow: { flexDirection: "row", alignItems: "center", gap: spacing[2] },
		// Selo "correndo" de quem ainda não terminou
		live: {
			fontFamily: fonts.bold,
			fontSize: sizes.label,
			color: colors.route,
			textTransform: "uppercase",
		},
		numbers: { flexDirection: "row", gap: spacing[3] },
		number: {
			fontFamily: fonts.bold,
			fontSize: sizes.sm,
			fontVariant: [...tabularNums],
			color: colors.textPrimary,
		},
		label: { fontFamily: fonts.medium, fontSize: sizes.label, color: colors.textSecondary },
	};
};
