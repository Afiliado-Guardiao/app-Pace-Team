import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { IButtonSize, IButtonStyles, IButtonVariant } from "../types";

export const createButtonStyles = (
	theme: ITheme,
	variant: IButtonVariant,
	size: IButtonSize,
	disabled: boolean,
): IButtonStyles => {
	const baseContainer: ViewStyle = {
		borderRadius: theme.borderRadius.sm,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
	};

	const baseText: TextStyle = {
		fontFamily: theme.typography.fontFamilies.semibold,
	};

	const sizeStyles = {
		sm: {
			container: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md },
			text: { fontSize: theme.typography.sizes.sm },
		},
		md: {
			container: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.lg },
			text: { fontSize: theme.typography.sizes.base },
		},
		lg: {
			container: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl },
			text: { fontSize: theme.typography.sizes.lg },
		},
	};

	const variantStyles = {
		default: {
			container: { backgroundColor: theme.colors.text },
			text: { color: theme.colors.background },
		},
		outline: {
			container: {
				backgroundColor: "transparent",
				borderWidth: theme.borderWidth.medium,
				borderColor: theme.colors.text,
			},
			text: { color: theme.colors.text },
		},
		ghost: {
			container: { backgroundColor: "transparent" },
			text: { color: theme.colors.text },
		},
		success: {
			container: { backgroundColor: theme.colors.success },
			text: { color: theme.colors.white },
		},
		error: {
			container: { backgroundColor: theme.colors.danger },
			text: { color: theme.colors.white },
		},
		warning: {
			container: { backgroundColor: theme.colors.warning },
			text: { color: theme.colors.white },
		},
	};

	const disabledStyle = disabled
		? {
				container: { opacity: 0.5 },
				text: {},
			}
		: { container: {}, text: {} };

	return {
		container: {
			...baseContainer,
			...sizeStyles[size].container,
			...variantStyles[variant].container,
			...disabledStyle.container,
		},
		text: {
			...baseText,
			...sizeStyles[size].text,
			...variantStyles[variant].text,
			...disabledStyle.text,
		},
	};
};
