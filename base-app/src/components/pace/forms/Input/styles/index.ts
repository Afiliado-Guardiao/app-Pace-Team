import { ITheme } from "@/theme";

import { tracking } from "../../../utils";
import { IInputStyles } from "../types";

const FIELD_HEIGHT = 54;
const FIELD_PADDING_X = 16;
const DISABLED_OPACITY = 0.5;

const borderColorOf = (theme: ITheme, state: { hasError: boolean; isFocused: boolean }): string => {
	const { colors } = theme.pace;
	if (state.hasError) return colors.statusDanger;
	return state.isFocused ? colors.accentRing : colors.glassBorder;
};

export const createInputStyles = (
	theme: ITheme,
	state: { hasError: boolean; isFocused: boolean; disabled: boolean },
): IInputStyles => {
	const { blur, colors, shadows, spacing, typography } = theme.pace;
	const { sizes, fonts, lineHeights } = typography;

	return {
		root: { width: "100%", gap: spacing[2] },
		label: {
			fontFamily: fonts.semibold,
			fontSize: sizes.label,
			letterSpacing: tracking(typography.tracking.input, sizes.label),
			color: colors.textSecondary,
		},
		field: {
			height: FIELD_HEIGHT,
			paddingHorizontal: FIELD_PADDING_X,
			flexDirection: "row",
			alignItems: "center",
			gap: spacing[2.5],
			opacity: state.disabled ? DISABLED_OPACITY : 1,
		},
		input: {
			flex: 1,
			minWidth: 0,
			height: "100%",
			padding: 0,
			fontFamily: fonts.medium,
			fontSize: sizes.body,
			color: colors.textPrimary,
		},
		message: {
			fontFamily: fonts.medium,
			fontSize: sizes.label,
			lineHeight: sizes.label * lineHeights.caption,
			color: state.hasError ? colors.statusDanger : colors.textTertiary,
		},
		appearance: {
			fill: { color: colors.surfaceInput },
			blur: blur.intensity.glass,
			border: borderColorOf(theme, state),
			rim: true,
			outerShadow: state.isFocused ? shadows.inputFocus : undefined,
			innerShadow: state.isFocused ? undefined : shadows.innerHighlight,
		},
		iconColor: state.isFocused ? colors.orange[400] : colors.textTertiary,
		placeholderColor: colors.textTertiary,
	};
};
