import { ITheme } from "@/theme";

export const createLanguageSwitcherStyles = (theme: ITheme) => ({
	button: {
		paddingHorizontal: theme.spacing.sm,
		paddingVertical: theme.spacing.xs,
		flexDirection: "row" as const,
		alignItems: "center" as const,
		justifyContent: "center" as const,
		gap: theme.spacing.xs,
	},
	flag: {
		fontSize: theme.typography.sizes.base,
	},
	code: {
		fontSize: theme.typography.sizes.xs,
		fontFamily: theme.typography.fontFamilies.semibold,
		color: theme.colors.textSecondary,
		letterSpacing: theme.typography.letterSpacing.wide,
	},
	overlay: {
		flex: 1,
		backgroundColor: theme.colors.overlay,
		justifyContent: "center" as const,
		alignItems: "center" as const,
	},
	modalContent: {
		backgroundColor: theme.colors.surface,
		borderRadius: theme.borderRadius.xl,
		width: 320,
		maxHeight: 480,
		paddingVertical: theme.spacing.sm,
		...theme.shadows.high,
	},
	option: {
		flexDirection: "row" as const,
		alignItems: "center" as const,
		paddingVertical: theme.spacing.sm,
		paddingHorizontal: theme.spacing.lg,
		gap: theme.spacing.sm,
	},
	activeOption: {
		backgroundColor: theme.colors.textMuted,
	},
	optionFlag: {
		fontSize: theme.typography.sizes["2xl"],
	},
	optionText: {
		flex: 1,
		fontSize: theme.typography.sizes.base,
		fontFamily: theme.typography.fontFamilies.regular,
		color: theme.colors.text,
	},
	activeOptionText: {
		fontFamily: theme.typography.fontFamilies.semibold,
	},
	checkmark: {
		fontSize: theme.typography.sizes.lg,
		color: theme.colors.text,
	},
});
