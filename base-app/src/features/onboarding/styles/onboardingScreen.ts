import { ITheme } from "@/theme";

import { IActionButtonStyles, IBackButtonStyles } from "../types";

export const createBaseStepStyles = (theme: ITheme) => ({
	container: {
		flex: 1,
		justifyContent: "center" as const,
		alignItems: "center" as const,
		paddingHorizontal: theme.spacing.lg,
	},
	title: {
		fontSize: theme.typography.sizes["2xl"],
		fontFamily: theme.typography.fontFamilies.bold,
		color: theme.colors.text,
		textAlign: "center" as const,
		marginBottom: theme.spacing.md,
	},
	subtitle: {
		fontSize: theme.typography.sizes.base,
		fontFamily: theme.typography.fontFamilies.regular,
		color: theme.colors.textSecondary,
		textAlign: "center" as const,
	},
});

export const createActionButtonStyles = (
	theme: ITheme,
	disabled: boolean,
): IActionButtonStyles => ({
	container: {
		padding: theme.spacing.lg,
		backgroundColor: theme.colors.background,
	},
	button: {
		width: "100%",
		height: theme.componentSizes.button.md,
		borderRadius: theme.borderRadius.md,
		backgroundColor: theme.colors.text,
		justifyContent: "center",
		alignItems: "center",
		opacity: disabled ? 0.5 : 1,
	},
	text: {
		fontSize: theme.typography.sizes.lg,
		fontFamily: theme.typography.fontFamilies.bold,
		color: theme.colors.background,
	},
});

export const createBackButtonStyles = (theme: ITheme, disabled: boolean): IBackButtonStyles => ({
	button: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: theme.spacing.xs,
		width: theme.componentSizes.button.sm,
		height: theme.componentSizes.button.sm,
		paddingVertical: theme.spacing.sm,
		paddingHorizontal: theme.spacing.md,
		borderRadius: theme.borderRadius.sm,
		opacity: disabled ? 0.3 : 1,
	},
	text: {
		fontSize: theme.typography.sizes.base,
		fontFamily: theme.typography.fontFamilies.medium,
		color: theme.colors.text,
	},
});

export const createOnboardingScreenStyles = (theme: ITheme) => ({
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
	scrollContent: {
		flexGrow: 1,
	},
	keyboardScroll: {
		flex: 1,
	},
});
