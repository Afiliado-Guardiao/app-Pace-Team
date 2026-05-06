import { ITheme } from "@/theme";

import { IBackButtonStyles } from "../types";

export const createBackButtonStyles = (theme: ITheme, disabled: boolean): IBackButtonStyles => ({
	button: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: theme.spacing.xs,
		width: theme.componentSizes.button.sm,
		height: theme.componentSizes.button.sm,
		paddingVertical: theme.spacing.sm,
		paddingHorizontal: theme.spacing.md,
		borderRadius: theme.borderRadius.sm,
		opacity: disabled ? 0.3 : 1,
	},
	text: {
		fontSize: theme.typography.sizes.base,
		fontFamily: theme.typography.fontFamilies.medium,
		color: theme.colors.text,
	},
});
