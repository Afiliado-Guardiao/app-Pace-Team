import { ITheme } from "@/theme";

import { IGlassAppearance } from "../../../primitives";
import { IGlassCardStyles, IGlassCardVariant } from "../types";

const variantAppearance = (theme: ITheme, variant: IGlassCardVariant): IGlassAppearance => {
	const { colors } = theme.pace;
	const variants: Record<IGlassCardVariant, IGlassAppearance> = {
		default: { fill: "glassFill", border: colors.glassBorder },
		strong: { fill: "cardStrong", border: colors.glassBorderStrong },
		dark: { fill: { color: colors.glassDark }, border: colors.hairline },
		accent: { fill: "cardAccent", border: colors.accentBorderSoft },
	};

	return variants[variant];
};

export const createGlassCardStyles = (
	theme: ITheme,
	options: { variant: IGlassCardVariant; padding: number },
): IGlassCardStyles => {
	const { blur, shadows } = theme.pace;

	return {
		surface: { padding: options.padding, overflow: "visible" },
		image: {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			resizeMode: "cover",
		},
		appearance: {
			...variantAppearance(theme, options.variant),
			blur: blur.intensity.glass,
			rim: true,
			outerShadow: shadows.glassOuter,
			innerShadow: shadows.glassInner,
		},
	};
};
