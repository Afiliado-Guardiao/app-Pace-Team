import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { ITextInputStyles } from "../types";

export const createTextInputStyles = (
	theme: ITheme,
	hasError: boolean,
	isFocused: boolean,
	disabled: boolean,
): ITextInputStyles => {
	const borderColor = hasError
		? theme.colors.danger
		: isFocused
			? theme.colors.text
			: theme.colors.border;

	const borderWidth = isFocused || hasError ? theme.borderWidth.medium : theme.borderWidth.hairline;

	const container: ViewStyle = {
		borderWidth,
		borderColor,
		borderRadius: theme.borderRadius.md,
		backgroundColor: disabled ? theme.colors.surface : theme.colors.background,
		opacity: disabled ? 0.5 : 1,
	};

	const input: TextStyle = {
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
		fontSize: theme.typography.sizes.base,
		fontFamily: theme.typography.fontFamilies.regular,
		color: theme.colors.text,
		minHeight: theme.componentSizes.input.default,
	};

	const errorText: TextStyle = {
		fontSize: theme.typography.sizes.sm,
		fontFamily: theme.typography.fontFamilies.regular,
		color: theme.colors.danger,
		marginTop: theme.spacing.xs,
		marginLeft: theme.spacing.xs,
	};

	return {
		container,
		input,
		errorText,
	};
};
