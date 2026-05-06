import { ITheme } from "@/theme";

import { ISectionStyles } from "../types";

export const createSectionStyles = (theme: ITheme): ISectionStyles => ({
	container: {
		backgroundColor: theme.colors.background,
		borderRadius: theme.borderRadius.lg,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.md,
		...theme.shadows.low,
	},
	title: {
		fontSize: theme.typography.sizes.xs,
		fontFamily: theme.typography.fontFamilies.semibold,
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.md,
		textTransform: "uppercase",
		letterSpacing: theme.typography.letterSpacing.normal,
	},
});
