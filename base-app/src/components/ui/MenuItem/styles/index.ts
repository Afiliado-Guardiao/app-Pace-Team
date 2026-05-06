import { ITheme } from "@/theme";

import { IMenuItemStyles } from "../types";

export const createMenuItemStyles = (theme: ITheme): IMenuItemStyles => ({
	container: {
		marginBottom: theme.spacing.md,
	},
	content: {
		flexDirection: "row",
		alignItems: "center",
	},
	contentPressed: {
		opacity: 0.7,
	},
	iconContainer: {
		width: theme.componentSizes.icon.xl,
		height: theme.componentSizes.icon.xl,
		borderRadius: theme.borderRadius.sm,
		backgroundColor: theme.colors.text,
		justifyContent: "center",
		alignItems: "center",
		marginRight: theme.spacing.md,
	},
	label: {
		flex: 1,
		fontSize: theme.typography.sizes.lg,
		color: theme.colors.text,
		fontFamily: theme.typography.fontFamilies.regular,
	},
	value: {
		fontSize: theme.typography.sizes.sm,
		color: theme.colors.textMuted,
		fontFamily: theme.typography.fontFamilies.regular,
		marginRight: theme.spacing.sm,
	},
});
