import { ITheme } from "@/theme";

import { IGlassAppearance } from "../../../primitives";
import { IIconButtonStyles, IIconButtonVariant } from "../types";

const ICON_RATIO = 0.43;
const BADGE_SIZE = 8;
const BADGE_TOP_RATIO = 0.2;
const BADGE_RIGHT_RATIO = 0.22;
const DISABLED_OPACITY = 0.4;

const createAppearance = (
	theme: ITheme,
	variant: IIconButtonVariant,
): { appearance: IGlassAppearance; color: string } => {
	const { blur, colors, shadows } = theme.pace;
	const variants: Record<IIconButtonVariant, { appearance: IGlassAppearance; color: string }> = {
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
		accent: {
			appearance: {
				fill: "accent",
				border: null,
				rim: true,
				outerShadow: shadows.glowAccentOuter,
				innerShadow: shadows.glowAccentInner,
			},
			color: colors.ink.white,
		},
		dark: {
			appearance: {
				fill: { color: colors.glassDark },
				blur: blur.intensity.glass,
				border: colors.hairline,
				rim: true,
			},
			color: colors.textPrimary,
		},
		light: {
			appearance: { fill: { color: colors.glassLight }, border: null },
			color: colors.slate[900],
		},
	};

	return variants[variant];
};

export const createIconButtonStyles = (
	theme: ITheme,
	options: { variant: IIconButtonVariant; size: number; disabled: boolean },
): IIconButtonStyles => {
	const { colors, shadows } = theme.pace;
	const { size } = options;
	const { appearance, color } = createAppearance(theme, options.variant);

	return {
		pressable: { alignSelf: "flex-start", opacity: options.disabled ? DISABLED_OPACITY : 1 },
		surface: { width: size, height: size, alignItems: "center", justifyContent: "center" },
		badge: {
			position: "absolute",
			top: size * BADGE_TOP_RATIO,
			right: size * BADGE_RIGHT_RATIO,
			width: BADGE_SIZE,
			height: BADGE_SIZE,
			borderRadius: BADGE_SIZE / 2,
			backgroundColor: colors.orange[500],
			boxShadow: shadows.stackRing,
		},
		appearance,
		iconColor: color,
		iconSize: Math.round(size * ICON_RATIO),
	};
};
