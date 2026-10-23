import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

export const SCRIM_HEIGHT = 200;

const SIDE = 20;
const RAIL_SPACE = 66;
const BOTTOM = 40;
const DOT = 6;

export const createMapStyles = (theme: ITheme, insets: { top: number; bottom: number }) => {
	const { blur, colors, spacing, typography } = theme.pace;

	return {
		root: { flex: 1, backgroundColor: colors.bgApp } as ViewStyle,
		scrim: { position: "absolute", top: 0, left: 0, right: 0, height: SCRIM_HEIGHT } as ViewStyle,
		top: {
			position: "absolute",
			top: insets.top + 8,
			left: SIDE,
			right: SIDE,
			gap: spacing[3],
		} as ViewStyle,
		chips: { flexDirection: "row", gap: spacing[2] } as ViewStyle,
		bottom: {
			position: "absolute",
			left: 0,
			right: RAIL_SPACE,
			bottom: insets.bottom + BOTTOM,
			gap: 10,
		} as ViewStyle,
		note: {
			marginHorizontal: SIDE,
			flexDirection: "row",
			alignItems: "center",
			gap: spacing[2],
			paddingVertical: 10,
			paddingHorizontal: 14,
		} as ViewStyle,
		noteAppearance: {
			fill: { color: colors.mapNoteBg },
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
		},
		noteText: {
			flex: 1,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.label,
			lineHeight: typography.sizes.label * 1.35,
			color: colors.ink[200],
		} as TextStyle,
		railContent: { gap: 10, paddingHorizontal: SIDE, paddingVertical: 2 } as ViewStyle,
		dots: { flexDirection: "row", justifyContent: "center", gap: 5 } as ViewStyle,
		dot: {
			width: DOT,
			height: DOT,
			borderRadius: DOT / 2,
			backgroundColor: colors.pagerDotOff,
		} as ViewStyle,
		dotOn: { width: 16, backgroundColor: colors.ink.white } as ViewStyle,
	};
};
