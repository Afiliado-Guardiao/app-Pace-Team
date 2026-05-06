import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

export const createSyncErrorModalStyles = (
	theme: ITheme,
): {
	overlay: ViewStyle;
	modalContent: ViewStyle;
	iconContainer: ViewStyle;
	title: TextStyle;
	message: TextStyle;
	buttonContainer: ViewStyle;
} => ({
	overlay: {
		flex: 1,
		backgroundColor: theme.colors.overlay,
		justifyContent: "center",
		alignItems: "center",
		padding: theme.spacing.xl,
	},
	modalContent: {
		width: "100%",
		maxWidth: 400,
		backgroundColor: theme.colors.background,
		borderRadius: theme.borderRadius.xl,
		padding: theme.spacing.xl,
		alignItems: "center",
		gap: theme.spacing.lg,
	},
	iconContainer: {
		width: 56,
		height: 56,
		borderRadius: theme.borderRadius.full,
		backgroundColor: theme.colors.danger + "20",
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: theme.typography.sizes.xl,
		fontWeight: theme.typography.weights.bold as "700",
		color: theme.colors.text,
		textAlign: "center",
	},
	message: {
		fontSize: theme.typography.sizes.base,
		color: theme.colors.textSecondary,
		textAlign: "center",
		lineHeight: theme.typography.sizes.base * 1.5,
	},
	buttonContainer: {
		width: "100%",
		marginTop: theme.spacing.sm,
	},
});
