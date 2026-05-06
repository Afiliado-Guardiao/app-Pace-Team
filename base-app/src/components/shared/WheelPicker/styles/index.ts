import { ITheme } from "@/theme/types";

import { IWheelPickerStyles } from "../types";

export const createWheelPickerStyles = (
	theme: ITheme,
	pickerWidth: number,
): IWheelPickerStyles => ({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	label: {
		fontFamily: theme.typography.fontFamilies.medium,
		fontSize: theme.typography.sizes.sm,
		marginBottom: theme.spacing.sm,
		textAlign: "center",
		color: theme.colors.text,
	},
	pickerWrapper: {
		width: pickerWidth,
		height: 180,
	},
	pickerContainer: {
		width: pickerWidth,
		height: 180,
		backgroundColor: "transparent",
	},
});
