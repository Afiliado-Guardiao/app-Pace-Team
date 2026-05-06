import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

export const createEmailAuthModalStyles = (
	theme: ITheme,
): {
	overlay: ViewStyle;
	modalContent: ViewStyle;
	header: ViewStyle;
	title: TextStyle;
	closeButton: ViewStyle;
	scrollContent: ViewStyle;
	form: ViewStyle;
	submitButton: ViewStyle;
	switchButton: ViewStyle;
	switchText: TextStyle;
	switchTextBold: TextStyle;
} => ({
	overlay: {
		flex: 1,
		backgroundColor: theme.colors.overlay,
		justifyContent: "flex-end",
		padding: 0,
	},
	modalContent: {
		width: "100%",
		maxHeight: "90%",
		backgroundColor: theme.colors.background,
		borderTopLeftRadius: theme.borderRadius.xl,
		borderTopRightRadius: theme.borderRadius.xl,
		padding: theme.spacing.xl,
		paddingBottom: theme.spacing["3xl"],
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: theme.spacing.xl,
	},
	title: {
		fontSize: theme.typography.sizes.xl,
		fontWeight: theme.typography.weights.bold as "700",
		color: theme.colors.text,
	},
	closeButton: {
		padding: theme.spacing.xs,
		borderRadius: theme.borderRadius.full,
		backgroundColor: theme.colors.surface,
	},
	scrollContent: {
		paddingBottom: theme.spacing.lg,
	},
	form: {
		gap: theme.spacing.md,
	},
	submitButton: {
		marginTop: theme.spacing.lg,
	},
	switchButton: {
		alignItems: "center",
		marginTop: theme.spacing.md,
		padding: theme.spacing.sm,
	},
	switchText: {
		fontSize: theme.typography.sizes.base,
		color: theme.colors.textSecondary,
	},
	switchTextBold: {
		fontSize: theme.typography.sizes.base,
		color: theme.colors.primary,
		fontWeight: theme.typography.weights.semibold as "600",
	},
});
