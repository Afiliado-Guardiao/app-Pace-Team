import { ITheme } from "@/theme";

import { IReferralSectionStyles } from "../types";

export const createReferralSectionStyles = (theme: ITheme): IReferralSectionStyles => ({
	container: {
		marginTop: theme.spacing.lg,
		marginHorizontal: theme.spacing.md,
		padding: theme.spacing.md,
		backgroundColor: theme.colors.surface,
		borderRadius: theme.borderRadius.md,
	},
	title: {
		fontSize: theme.typography.sizes.sm,
		fontFamily: theme.typography.fontFamilies.medium,
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.sm,
		letterSpacing: theme.typography.letterSpacing.wide,
	},
	myCodeRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: theme.spacing.xs,
	},
	myCodeText: {
		fontSize: theme.typography.sizes["2xl"],
		fontFamily: theme.typography.fontFamilies.bold,
		color: theme.colors.text,
		letterSpacing: theme.typography.letterSpacing.tight,
	},
	copyIconButton: {
		width: 36,
		height: 36,
		borderRadius: theme.borderRadius.md,
		backgroundColor: theme.colors.border,
		justifyContent: "center",
		alignItems: "center",
	},
	usedCodeRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xs,
		marginTop: theme.spacing.sm,
	},
	usedCodeText: {
		fontSize: theme.typography.sizes.xs,
		fontFamily: theme.typography.fontFamilies.regular,
		color: theme.colors.textMuted,
	},
	inputRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.sm,
		marginTop: theme.spacing.sm,
	},
	input: {
		flex: 1,
		height: 40,
		paddingHorizontal: theme.spacing.md,
		backgroundColor: theme.colors.background,
		borderRadius: theme.borderRadius.sm,
		color: theme.colors.text,
	},
	applyButton: {
		paddingVertical: theme.spacing.sm,
		paddingHorizontal: theme.spacing.md,
		backgroundColor: theme.colors.primary,
		borderRadius: theme.borderRadius.sm,
	},
	applyButtonText: {
		fontSize: theme.typography.sizes.sm,
		fontFamily: theme.typography.fontFamilies.semibold,
		color: theme.colors.primaryForeground,
	},
	countRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xs,
		marginTop: theme.spacing.md,
	},
	countText: {
		fontSize: theme.typography.sizes.xs,
		fontFamily: theme.typography.fontFamilies.regular,
		color: theme.colors.textSecondary,
	},
});
