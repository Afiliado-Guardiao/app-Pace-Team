import { ITheme } from "@/theme";

import {
	RAIL_GAP,
	RAIL_ICON_RATIO,
	RAIL_LABEL_HEIGHT,
	RAIL_LABEL_OFFSET,
	RAIL_LABEL_PADDING_X,
	RAIL_PADDING,
} from "../constants";
import { ISideRailStyles } from "../types";

export const createSideRailStyles = (theme: ITheme, size: number): ISideRailStyles => {
	const { blur, colors, shadows, typography } = theme.pace;

	return {
		surface: { padding: RAIL_PADDING, gap: RAIL_GAP },
		disc: {
			position: "absolute",
			left: RAIL_PADDING,
			top: RAIL_PADDING,
			width: size,
			height: size,
		},
		discAppearance: {
			fill: "accent",
			border: null,
			outerShadow: shadows.railDiscOuter,
			innerShadow: shadows.railDiscInner,
		},
		railAppearance: {
			fill: "glassFill",
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
			outerShadow: shadows.glassOuter,
			innerShadow: shadows.glassInner,
		},
		item: { width: size, height: size, alignItems: "center", justifyContent: "center" },
		label: {
			position: "absolute",
			right: "100%",
			marginRight: RAIL_LABEL_OFFSET,
			height: RAIL_LABEL_HEIGHT,
			paddingHorizontal: RAIL_LABEL_PADDING_X,
			justifyContent: "center",
		},
		labelText: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.label,
			color: colors.ink.white,
		},
		labelAppearance: {
			fill: { color: colors.glassTooltip },
			blur: blur.intensity.tooltip,
			border: colors.glassBorder,
			rim: true,
		},
		iconSize: Math.round(size * RAIL_ICON_RATIO),
	};
};
