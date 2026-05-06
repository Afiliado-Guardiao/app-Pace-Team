import { ITheme } from "@/theme";

export const createAuthButtonStyles = (theme: ITheme) => ({
	appleButton: {
		width: "100%" as const,
		backgroundColor: theme.colors.text,
	},
	appleButtonContent: {
		flexDirection: "row" as const,
		alignItems: "center" as const,
		justifyContent: "center" as const,
		gap: theme.spacing.sm,
	},
	appleButtonText: {
		color: theme.colors.background,
		fontSize: theme.typography.sizes.base,
		fontFamily: theme.typography.fontFamilies.medium,
	},
	googleButton: {
		width: "100%" as const,
		marginTop: theme.spacing.md,
		borderColor: theme.colors.border,
	},
	googleButtonContent: {
		flexDirection: "row" as const,
		alignItems: "center" as const,
		justifyContent: "center" as const,
		gap: theme.spacing.sm,
	},
	googleButtonText: {
		color: theme.colors.text,
		fontSize: theme.typography.sizes.base,
		fontFamily: theme.typography.fontFamilies.medium,
	},
	emailButton: {
		width: "100%" as const,
		marginTop: theme.spacing.md,
		borderColor: theme.colors.border,
	},
	emailButtonText: {
		color: theme.colors.text,
		fontSize: theme.typography.sizes.base,
		fontFamily: theme.typography.fontFamilies.medium,
		textAlign: "center" as const,
	},
	devButton: {
		width: "100%" as const,
		marginTop: theme.spacing.md,
		borderColor: theme.colors.warning,
		borderWidth: 2,
	},
	devButtonText: {
		color: theme.colors.warning,
		fontSize: theme.typography.sizes.sm,
		fontFamily: theme.typography.fontFamilies.medium,
		textAlign: "center" as const,
	},
});
