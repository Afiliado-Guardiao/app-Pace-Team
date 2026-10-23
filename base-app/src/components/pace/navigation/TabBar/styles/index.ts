import { ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { ACTIVE_STROKE, ICON_RATIO, IDLE_STROKE, LABEL_GAP, TAB_GAP } from "../constants";
import { ITabButtonStyles } from "../types";

export const createTabBarStyles = (): { root: ViewStyle } => ({
	root: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: TAB_GAP },
});

export const createTabButtonStyles = (
	theme: ITheme,
	options: { size: number; isActive: boolean; isAccent: boolean },
): ITabButtonStyles => {
	const { blur, colors, shadows, typography } = theme.pace;
	const { isActive, isAccent, size } = options;
	const shared = { blur: blur.intensity.glass, rim: true };

	const appearance = isActive
		? {
				...shared,
				fill: { color: colors.orange[500] },
				border: colors.accentBorderTab,
				outerShadow: shadows.tabActiveOuter,
				innerShadow: shadows.tabActiveInner,
			}
		: isAccent
			? {
					...shared,
					fill: "accent" as const,
					border: colors.accentBorderTab,
					outerShadow: shadows.tabAccentOuter,
					innerShadow: shadows.tabAccentInner,
				}
			: {
					...shared,
					fill: { color: colors.surfaceTabIdle },
					border: colors.glassBorder,
					outerShadow: shadows.glassOuter,
					innerShadow: shadows.glassInner,
				};

	return {
		button: {
			width: size,
			height: size,
			alignItems: "center",
			justifyContent: "center",
			gap: LABEL_GAP,
		},
		label: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.tabLabel,
			color: colors.ink.white,
		},
		appearance,
		iconSize: Math.round(size * ICON_RATIO),
		strokeWidth: isActive ? ACTIVE_STROKE : IDLE_STROKE,
	};
};
