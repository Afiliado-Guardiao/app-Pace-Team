import { DimensionValue } from "react-native";

import { ITheme } from "@/theme";

import { IProgressBarStyles } from "../types";

export const createProgressBarStyles = (theme: ITheme, progress: number): IProgressBarStyles => {
	const progressWidth = `${progress.toString()}%` as DimensionValue;
	return {
		container: {
			flex: 1,
			height: theme.spacing.sm * 0.6,
			backgroundColor: theme.colors.border,
			borderRadius: theme.borderRadius.sm,
			overflow: "hidden",
			marginLeft: theme.spacing.sm,
			marginRight: theme.spacing.lg,
		},
		fill: {
			height: "100%",
			width: progressWidth,
			backgroundColor: theme.colors.text,
			borderRadius: theme.borderRadius.sm,
		},
	};
};
