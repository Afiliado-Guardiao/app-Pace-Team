import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

export const PRO_FAB_SIZE = 52;
const RIGHT = 10;
// Distância da borda (o arrasto gruda nas duas bordas com essa folga)
export const PRO_FAB_EDGE = RIGHT;
const BOTTOM = 22;
const BUDDY_SCALE = 0.5;
const ITEM_H = 46;
const DOT = 32;

interface IProFabStyles {
	backdrop: ViewStyle;
	root: ViewStyle;
	menu: ViewStyle;
	item: ViewStyle;
	itemDot: ViewStyle;
	itemText: TextStyle;
	fab: ViewStyle;
	figure: ViewStyle;
	iconColor: string;
}

// Fica sozinho no canto de baixo à direita, abaixo do trilho das abas
export const createProFabStyles = (
	theme: ITheme,
	bottomInset: number,
	isLeft = false,
): IProFabStyles => {
	const { colors, spacing, typography, shadows } = theme.pace;
	return {
		backdrop: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: colors.surfaceScrim,
			zIndex: 29,
		},
		root: {
			position: "absolute",
			right: RIGHT,
			bottom: bottomInset + BOTTOM,
			alignItems: isLeft ? "flex-start" : "flex-end",
			gap: spacing[3],
			zIndex: 30,
		},
		menu: { alignItems: isLeft ? "flex-start" : "flex-end", gap: spacing[2] },
		item: {
			height: ITEM_H,
			flexDirection: "row",
			alignItems: "center",
			gap: spacing[2],
			paddingLeft: spacing[2],
			paddingRight: spacing[4],
			borderRadius: ITEM_H / 2,
			backgroundColor: colors.glassPanel,
			borderWidth: 1,
			borderColor: colors.accentBorderSoft,
			boxShadow: shadows.float,
		},
		itemDot: {
			width: DOT,
			height: DOT,
			borderRadius: DOT / 2,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: colors.accent,
		},
		itemText: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.xs,
			letterSpacing: 0.6,
			color: colors.textPrimary,
		},
		fab: {
			width: PRO_FAB_SIZE,
			height: PRO_FAB_SIZE,
			borderRadius: PRO_FAB_SIZE / 2,
			overflow: "hidden",
			borderWidth: 1,
			borderColor: colors.accentBorderTab,
			boxShadow: shadows.glowAccentOuter,
		},
		figure: {
			position: "absolute",
			left: (PRO_FAB_SIZE - 140 * BUDDY_SCALE) / 2,
			top: (PRO_FAB_SIZE - 135 * BUDDY_SCALE) / 2 + 4,
			transform: [{ scale: BUDDY_SCALE }],
			transformOrigin: "0% 0%",
		},
		iconColor: colors.onAccent,
	};
};
