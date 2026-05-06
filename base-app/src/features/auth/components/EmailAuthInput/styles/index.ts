import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

export const createEmailAuthInputStyles = (
	theme: ITheme,
	hasError: boolean,
	isFocused: boolean,
): {
	container: ViewStyle;
	label: TextStyle;
	inputWrapper: ViewStyle;
	input: TextStyle;
	eyeIcon: ViewStyle;
	errorText: TextStyle;
} => ({
	container: {
		marginBottom: theme.spacing.md,
	},
	label: {
		fontSize: theme.typography.sizes.sm,
		fontWeight: theme.typography.weights.medium as "600",
		color: theme.colors.text,
		marginBottom: theme.spacing.xs,
	},
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: theme.colors.surface,
		borderWidth: 1,
		borderColor: hasError
			? theme.colors.danger
			: isFocused
				? theme.colors.primary
				: theme.colors.border,
		borderRadius: theme.borderRadius.md,
		paddingHorizontal: theme.spacing.md,
		height: 48,
	},
	input: {
		flex: 1,
		fontSize: theme.typography.sizes.base,
		color: theme.colors.text,
	},
	eyeIcon: {
		padding: theme.spacing.xs,
	},
	errorText: {
		fontSize: theme.typography.sizes.sm,
		color: theme.colors.danger,
		marginTop: theme.spacing.xs,
	},
});
