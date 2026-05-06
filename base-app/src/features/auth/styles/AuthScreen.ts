import { ITheme } from "@/theme";

import { createAuthButtonStyles } from "./authButtons";

export const createAuthScreenStyles = (theme: ITheme) => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	header: {
		height: theme.componentSizes.header.height,
		flexDirection: "row" as const,
		alignItems: "center" as const,
		paddingLeft: theme.spacing.lg,
		paddingRight: theme.spacing.md,
	},
	content: {
		flex: 1,
		justifyContent: "center" as const,
		alignItems: "center" as const,
		paddingHorizontal: theme.spacing.xl,
	},
	titleContainer: {
		marginBottom: theme.spacing["2xl"],
		alignItems: "center" as const,
	},
	title: {
		marginBottom: theme.spacing.sm,
		textAlign: "center" as const,
	},
	subtitle: {
		color: theme.colors.textSecondary,
		fontSize: theme.typography.sizes.base,
		textAlign: "center" as const,
		fontFamily: theme.typography.fontFamilies.regular,
	},
	buttonContainer: {
		width: "100%" as const,
		maxWidth: 320,
		marginTop: theme.spacing.lg,
	},
	unavailableContainer: {
		paddingHorizontal: theme.spacing.xl,
		paddingVertical: theme.spacing.lg,
		backgroundColor: `${theme.colors.warning}15`,
		borderRadius: theme.borderRadius.md,
		maxWidth: 320,
	},
	unavailableText: {
		color: theme.colors.warning,
		fontSize: theme.typography.sizes.base,
		textAlign: "center" as const,
		fontFamily: theme.typography.fontFamilies.medium,
	},
	...createAuthButtonStyles(theme),
});
