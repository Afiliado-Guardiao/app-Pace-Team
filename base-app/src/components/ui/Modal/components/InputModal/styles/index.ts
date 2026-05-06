import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { IInputModalStyles } from "../types";

export const createInputModalStyles = (theme: ITheme): IInputModalStyles => {
	const title: TextStyle = {
		fontFamily: theme.typography.fontFamilies.bold,
		fontSize: theme.typography.sizes.lg,
		color: theme.colors.text,
		textAlign: "center",
		marginBottom: theme.spacing.md,
	};

	const input: ViewStyle & TextStyle = {
		borderWidth: 1,
		borderColor: theme.colors.border,
		borderRadius: theme.borderRadius.sm,
		paddingVertical: theme.spacing.sm,
		paddingHorizontal: theme.spacing.md,
		fontFamily: theme.typography.fontFamilies.regular,
		fontSize: theme.typography.sizes.base,
		color: theme.colors.text,
		backgroundColor: theme.colors.surface,
	};

	const inputError: ViewStyle = {
		borderColor: theme.colors.danger,
	};

	const errorText: TextStyle = {
		fontFamily: theme.typography.fontFamilies.regular,
		fontSize: theme.typography.sizes.xs,
		color: theme.colors.danger,
		marginTop: theme.spacing.xs,
	};

	const confirmButton: ViewStyle = {
		backgroundColor: theme.colors.primary,
		borderRadius: theme.borderRadius.sm,
		paddingVertical: theme.spacing.sm,
		paddingHorizontal: theme.spacing.lg,
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
	};

	const cancelButton: ViewStyle = {
		backgroundColor: "transparent",
		borderRadius: theme.borderRadius.sm,
		borderWidth: theme.borderWidth.medium,
		borderColor: theme.colors.border,
		paddingVertical: theme.spacing.sm,
		paddingHorizontal: theme.spacing.lg,
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
	};

	const confirmText: TextStyle = {
		fontFamily: theme.typography.fontFamilies.semibold,
		fontSize: theme.typography.sizes.base,
		color: theme.colors.primaryForeground,
	};

	const cancelText: TextStyle = {
		fontFamily: theme.typography.fontFamilies.semibold,
		fontSize: theme.typography.sizes.base,
		color: theme.colors.text,
	};

	const buttonRow: ViewStyle = {
		flexDirection: "row",
		gap: theme.spacing.sm,
		marginTop: theme.spacing.lg,
	};

	return {
		title,
		input,
		inputError,
		errorText,
		buttonRow,
		confirmButton,
		cancelButton,
		confirmText,
		cancelText,
	};
};
