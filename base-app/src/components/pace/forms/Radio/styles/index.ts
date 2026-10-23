import { ITheme } from "@/theme";

import { IRadioStyles } from "../types";

const CIRCLE = 22;
const DOT = 10;
const TEXT_GAP = 3;
const DISABLED_OPACITY = 0.45;

export const createRadioStyles = (
	theme: ITheme,
	options: { checked: boolean; disabled: boolean },
): IRadioStyles => {
	const { borders, colors, shadows, spacing, typography } = theme.pace;
	const { sizes, lineHeights, fonts } = typography;

	return {
		root: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacing[3],
			opacity: options.disabled ? DISABLED_OPACITY : 1,
		},
		circle: {
			width: CIRCLE,
			height: CIRCLE,
			flexShrink: 0,
			borderRadius: CIRCLE / 2,
			alignItems: "center",
			justifyContent: "center",
			borderWidth: borders.control,
			borderColor: options.checked ? colors.orange[500] : colors.glassBorderStrong,
			backgroundColor: options.checked ? colors.accentSoft : colors.glass1,
		},
		dot: {
			width: DOT,
			height: DOT,
			borderRadius: DOT / 2,
			backgroundColor: colors.orange[500],
			boxShadow: shadows.radioDot,
		},
		texts: { flexShrink: 1, gap: TEXT_GAP },
		label: {
			fontFamily: fonts.semibold,
			fontSize: sizes.ui,
			lineHeight: sizes.ui * lineHeights.snug,
			color: colors.textPrimary,
		},
		description: {
			fontFamily: fonts.medium,
			fontSize: sizes.label,
			lineHeight: sizes.label * lineHeights.caption,
			color: colors.textTertiary,
		},
	};
};
