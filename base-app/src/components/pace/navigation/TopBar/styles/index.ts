import { ITheme } from "@/theme";

import { ITopBarStyles } from "../types";

const TITLE_HEIGHT = 38;

export const createTopBarStyles = (theme: ITheme): ITopBarStyles => {
	const { blur, colors, layout, shadows, spacing, typography } = theme.pace;

	return {
		root: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			gap: spacing[3],
			height: layout.topBarHeight,
		},
		spacer: { width: layout.hitMin },
		titlePill: {
			flexDirection: "row",
			alignItems: "center",
			height: TITLE_HEIGHT,
			paddingHorizontal: spacing[4.5],
		},
		titleText: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		titleAppearance: {
			fill: { color: colors.glass2 },
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
			innerShadow: shadows.innerHighlight,
		},
	};
};
