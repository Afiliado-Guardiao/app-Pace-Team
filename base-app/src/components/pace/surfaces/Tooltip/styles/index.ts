import { ITheme } from "@/theme";

import { ITooltipPlacement, ITooltipStyles } from "../types";

const HEIGHT = 28;
const PADDING_X = 11;
const ARROW = 10;
const ARROW_OFFSET = -4;
const ARROW_RADIUS = 2;

export const createTooltipStyles = (
	theme: ITheme,
	options: { placement: ITooltipPlacement; accent: boolean },
): ITooltipStyles => {
	const { blur, colors, shadows, spacing, typography } = theme.pace;
	const background = options.accent ? colors.orange[500] : colors.glassTooltip;
	const arrowEdge = options.placement === "top" ? { bottom: ARROW_OFFSET } : { top: ARROW_OFFSET };

	return {
		surface: {
			alignSelf: "flex-start",
			flexDirection: "row",
			alignItems: "center",
			gap: spacing[1.5],
			height: HEIGHT,
			paddingHorizontal: PADDING_X,
		},
		arrow: {
			position: "absolute",
			left: "50%",
			marginLeft: -ARROW / 2,
			...arrowEdge,
			width: ARROW,
			height: ARROW,
			borderRadius: ARROW_RADIUS,
			backgroundColor: background,
			transform: [{ rotate: "45deg" }],
		},
		text: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.label,
			color: colors.ink.white,
		},
		appearance: {
			fill: { color: background },
			blur: blur.intensity.tooltip,
			border: options.accent ? null : colors.glassBorder,
			rim: !options.accent,
			outerShadow: shadows.tooltip,
		},
	};
};
