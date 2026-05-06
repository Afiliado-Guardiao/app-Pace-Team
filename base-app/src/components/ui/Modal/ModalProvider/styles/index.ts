import { StyleSheet } from "react-native";

import { ITheme } from "@/theme";

import { IModalProviderStyles } from "../types";

export const createModalProviderStyles = (theme: ITheme): IModalProviderStyles => ({
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: theme.colors.overlay,
		justifyContent: "center",
		alignItems: "center",
		padding: theme.spacing.lg,
	},
	sheet: {
		width: "100%",
		maxWidth: theme.componentSizes.modal.maxWidth,
		backgroundColor: theme.colors.background,
		borderRadius: theme.borderRadius.lg,
		padding: theme.spacing.lg,
	},
});
