import { ITheme } from "@/theme";

import { ICheckboxStyles } from "../types";

const BOX = 22;
const DISABLED_OPACITY = 0.45;
const LABEL_OFFSET = 1;

export const createCheckboxStyles = (
	theme: ITheme,
	options: { isOn: boolean; disabled: boolean },
): ICheckboxStyles => {
	const { borders, colors, radii, shadows, spacing, typography } = theme.pace;
	const fontSize = typography.sizes.ui;

	return {
		root: {
			flexDirection: "row",
			alignItems: "flex-start",
			gap: spacing[3],
			opacity: options.disabled ? DISABLED_OPACITY : 1,
		},
		box: {
			width: BOX,
			height: BOX,
			flexShrink: 0,
			borderRadius: radii.checkbox,
			alignItems: "center",
			justifyContent: "center",
			borderWidth: borders.control,
			borderColor: options.isOn ? colors.orange[500] : colors.glassBorderStrong,
			backgroundColor: options.isOn ? colors.orange[500] : colors.glass1,
			boxShadow: options.isOn ? shadows.checkboxOn : shadows.none,
		},
		label: {
			flexShrink: 1,
			paddingTop: LABEL_OFFSET,
			fontFamily: typography.fonts.medium,
			fontSize,
			lineHeight: fontSize * typography.lineHeights.body,
			color: colors.textSecondary,
		},
	};
};
