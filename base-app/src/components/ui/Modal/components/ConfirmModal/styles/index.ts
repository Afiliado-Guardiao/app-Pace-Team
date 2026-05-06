import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { IModalVariant } from "../../../types";
import { IConfirmModalStyles } from "../types";

export const createConfirmModalStyles = (
	theme: ITheme,
	variant: IModalVariant,
): IConfirmModalStyles => {
	const confirmColor = variant === "danger" ? theme.colors.danger : theme.colors.primary;

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
		backgroundColor: confirmColor,
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
		color: theme.colors.white,
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

	return { title, message, buttonRow, confirmButton, cancelButton, confirmText, cancelText };
};
