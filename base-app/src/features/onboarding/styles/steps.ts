import { TextStyle } from "react-native";

import { ITheme } from "@/theme";

import { IInputStepStyles, ITransitionStepStyles } from "../types";

import { createBaseStepStyles } from "./onboardingScreen";

export const createTransitionStepStyles = (theme: ITheme): ITransitionStepStyles => {
	const baseStyles = createBaseStepStyles(theme);
	return {
		...baseStyles,
	};
};

export const createInputStepStyles = (theme: ITheme): IInputStepStyles => {
	const baseStyles = createBaseStepStyles(theme);
	return {
		...baseStyles,
		subtitle: {
			...baseStyles.subtitle,
			marginBottom: theme.spacing.xl,
		},
		inputWrapper: {
			width: "100%",
		},
	};
};

export const createStepTitleLargeStyles = (theme: ITheme): TextStyle => ({
	fontSize: theme.typography.sizes.lg,
	fontFamily: theme.typography.fontFamilies.bold,
	fontWeight: theme.typography.weights.bold,
	color: theme.colors.text,
	marginTop: theme.spacing.sm,
	marginBottom: theme.spacing.sm,
	textAlign: "center",
});

export const createStepSubtitleSmallStyles = (theme: ITheme): TextStyle => ({
	fontSize: theme.typography.sizes.base,
	fontFamily: theme.typography.fontFamilies.regular,
	color: theme.colors.textSecondary,
	marginBottom: theme.spacing.xl,
	textAlign: "center",
	lineHeight: theme.typography.sizes.base * theme.typography.lineHeights.normal,
});

export const createPickersRowStyles = (theme: ITheme) => ({
	flexDirection: "row" as const,
	justifyContent: "center" as const,
	alignItems: "center" as const,
	gap: theme.spacing.sm,
	width: "100%" as const,
	height: 180,
	marginTop: theme.spacing.md,
});

export const createPickerWrapperStyles = () => ({
	flex: 1,
	alignItems: "center" as const,
});
