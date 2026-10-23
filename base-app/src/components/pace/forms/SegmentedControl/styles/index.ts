import { ITheme } from "@/theme";

import { ISegmentedControlStyles, ISegmentSize } from "../types";

const HEIGHT: Record<ISegmentSize, number> = { sm: 34, md: 42 };
const ITEM_PADDING_X: Record<ISegmentSize, number> = { sm: 9, md: 12 };
const CONTAINER_PADDING = 4;
const ITEM_GAP = 2;

export const createSegmentedControlStyles = (
	theme: ITheme,
	size: ISegmentSize,
): ISegmentedControlStyles => {
	const { blur, colors, shadows, typography } = theme.pace;
	const itemHeight = HEIGHT[size] - CONTAINER_PADDING * 2;
	const fontSize = size === "sm" ? typography.sizes.label : typography.sizes.sm;

	return {
		surface: { padding: CONTAINER_PADDING },
		content: { flexGrow: 1, gap: ITEM_GAP },
		pressable: { flexGrow: 1, flexShrink: 0 },
		item: {
			height: itemHeight,
			paddingHorizontal: ITEM_PADDING_X[size],
			alignItems: "center",
			justifyContent: "center",
		},
		itemText: { fontFamily: typography.fonts.semibold, fontSize, color: colors.textSecondary },
		activeText: { fontFamily: typography.fonts.bold, fontSize, color: colors.ink.white },
		containerAppearance: {
			fill: { color: colors.glass1 },
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
			innerShadow: shadows.innerHighlight,
		},
		activeAppearance: { fill: "accent", border: null, outerShadow: shadows.accentSoftGlow },
		idleAppearance: { border: null },
		itemRadius: itemHeight / 2,
	};
};
