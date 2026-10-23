import { ITheme } from "@/theme";

import { IGlassAppearance } from "../../../primitives";
import { tracking } from "../../../utils";
import { BUTTON_SIZES, DISABLED_OPACITY } from "../constants";
import { IPaceButtonSize, IPaceButtonStyles, IPaceButtonVariant } from "../types";

const createAppearance = (
	theme: ITheme,
	variant: IPaceButtonVariant,
): { appearance: IGlassAppearance; color: string } => {
	const { colors, shadows, blur } = theme.pace;
	const variants: Record<IPaceButtonVariant, { appearance: IGlassAppearance; color: string }> = {
		primary: {
			appearance: {
				fill: "accent",
				border: null,
				rim: true,
				outerShadow: shadows.glowAccentOuter,
				innerShadow: shadows.glowAccentInner,
			},
			color: colors.onAccent,
		},
		glass: {
			appearance: {
				fill: { color: colors.glass2 },
				blur: blur.intensity.glass,
				border: colors.glassBorder,
				rim: true,
				innerShadow: shadows.innerHighlight,
			},
			color: colors.textPrimary,
		},
		outline: { appearance: { border: colors.accentRing }, color: colors.orange[400] },
		ghost: { appearance: { border: colors.transparent }, color: colors.textSecondary },
		light: {
			appearance: { fill: { color: colors.ink[100] }, border: null },
			color: colors.navy[950],
		},
		whatsapp: {
			appearance: { fill: { color: colors.whatsapp }, border: null, rim: true },
			color: colors.onAccent,
		},
	};

	return variants[variant];
};

export const createPaceButtonStyles = (
	theme: ITheme,
	options: {
		variant: IPaceButtonVariant;
		size: IPaceButtonSize;
		disabled: boolean;
		fullWidth: boolean;
	},
): IPaceButtonStyles => {
	const { spacing, typography } = theme.pace;
	const size = BUTTON_SIZES[options.size];
	const fontSize = typography.sizes[size.fontSize];
	const { appearance, color } = createAppearance(theme, options.variant);

	return {
		pressable: {
			alignSelf: options.fullWidth ? "stretch" : "flex-start",
			opacity: options.disabled ? DISABLED_OPACITY : 1,
		},
		surface: {
			height: size.height,
			paddingHorizontal: size.paddingX,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			gap: spacing[2],
		},
		text: {
			fontFamily: typography.fonts.bold,
			fontSize,
			letterSpacing: tracking(typography.tracking.button, fontSize),
			color,
		},
		appearance,
		radius: size.height / 2,
		iconSize: size.icon,
	};
};
