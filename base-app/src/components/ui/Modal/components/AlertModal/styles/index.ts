import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { IAlertModalStyles } from "../types";

export const createAlertModalStyles = (theme: ITheme): IAlertModalStyles => {
	const title: TextStyle = {
		fontFamily: theme.typography.fontFamilies.bold,
		fontSize: theme.typography.sizes.lg,
		color: theme.colors.text,
		textAlign: "center",
		marginBottom: theme.spacing.sm,
	};

	const message: TextStyle = {
		fontFamily: theme.typography.fontFamilies.regular,
		fontSize: theme.typography.sizes.base,
		color: theme.colors.textSecondary,
		textAlign: "center",
		lineHeight: theme.typography.sizes.base * theme.typography.lineHeights.normal,
	};

	const confirmButton: ViewStyle = {
		backgroundColor: theme.colors.primary,
		borderRadius: theme.borderRadius.sm,
		paddingVertical: theme.spacing.sm,
		paddingHorizontal: theme.spacing.lg,
		alignItems: "center",
		justifyContent: "center",
		marginTop: theme.spacing.lg,
	};

	const confirmText: TextStyle = {
		fontFamily: theme.typography.fontFamilies.semibold,
		fontSize: theme.typography.sizes.base,
		color: theme.colors.primaryForeground,
	};

	return { title, message, confirmButton, confirmText };
};
