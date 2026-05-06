import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

export interface IDangerZoneStyles {
	container: ViewStyle;
	separator: ViewStyle;
	row: ViewStyle;
	rowContent: ViewStyle;
	rowText: TextStyle;
}

export const createDangerZoneStyles = (theme: ITheme): IDangerZoneStyles => ({
	container: {
		marginTop: theme.spacing.lg,
		marginHorizontal: theme.spacing.md,
	},
	separator: {
		height: 0.5,
		backgroundColor: theme.colors.border,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.md,
		gap: theme.spacing.md,
	},
	rowContent: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.md,
	},
	rowText: {
		fontSize: theme.typography.sizes.base,
		fontFamily: theme.typography.fontFamilies.regular,
		color: theme.colors.danger,
	},
});
