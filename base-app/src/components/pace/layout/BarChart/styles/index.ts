import { ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { IBarChartStyles } from "../types";

const LABEL_SPACE = 20;
const DEFAULT_RADIUS = 8;

export const createBarChartStyles = (
	theme: ITheme,
	options: { areaHeight: number; radius?: number; idleColor?: string },
): IBarChartStyles => {
	const { colors, shadows, spacing, typography } = theme.pace;
	const radius = options.radius ?? DEFAULT_RADIUS;
	const base: ViewStyle = { width: "100%", borderRadius: radius, transformOrigin: "bottom" };

	return {
		chart: {
			flexDirection: "row",
			alignItems: "flex-end",
			gap: spacing[2.5],
			height: options.areaHeight + LABEL_SPACE,
		},
		column: { flex: 1, alignItems: "center", justifyContent: "flex-end", gap: spacing[1.5] },
		bar: { ...base, backgroundColor: options.idleColor ?? colors.barIdle },
		barEmpty: { ...base, backgroundColor: colors.barEmpty },
		barHighlight: { ...base, boxShadow: shadows.barGlow },
		barClip: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			borderRadius: radius,
			overflow: "hidden",
		},
		label: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.micro,
			color: colors.textTertiary,
		},
	};
};
