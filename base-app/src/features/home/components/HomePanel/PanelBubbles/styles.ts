import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { ACRYLIC, LENS, PANEL } from "../constants";

const MAX = LENS.sizes[0];
// Buddy inteiro (140 × 135) cabe na bolinha com o rosto no centro
const BUD_SCALE = 0.42;

export const BUBBLE_ICON = Math.round(MAX * LENS.iconRatio);

export const createPanelBubblesStyles = (theme: ITheme) => {
	const { fonts } = theme.pace.typography;
	return {
		row: {
			position: "absolute",
			left: 0,
			right: 0,
			top: 0,
			height: PANEL.bubblesHeight,
		} as ViewStyle,
		bubble: {
			position: "absolute",
			left: 0,
			top: 0,
			width: MAX,
			height: MAX,
		} as ViewStyle,
		glass: {
			width: MAX,
			height: MAX,
			borderRadius: MAX / 2,
			overflow: "hidden",
			borderWidth: 1,
			borderColor: ACRYLIC.bubbleBorder,
			boxShadow: ACRYLIC.bubbleShadow,
			alignItems: "center",
			justifyContent: "center",
		} as ViewStyle,
		glassOn: { borderColor: ACRYLIC.bubbleBorderOn } as ViewStyle,
		fill: { position: "absolute", left: 0, top: 0, width: MAX, height: MAX } as ViewStyle,
		// Sem "filter: drop-shadow": no iPhone ele vira um quadrado branco
		icon: {} as ViewStyle,
		bud: {
			position: "absolute",
			left: (MAX - 140 * BUD_SCALE) / 2,
			top: (MAX - 135 * BUD_SCALE) / 2 + 3,
			transform: [{ scale: BUD_SCALE }],
			transformOrigin: "0% 0%",
		} as ViewStyle,
		label: {
			position: "absolute",
			left: 0,
			right: 0,
			top: PANEL.labelTop,
			textAlign: "center",
			fontFamily: fonts.semibold,
			fontSize: 12,
			color: theme.pace.colors.textPrimary,
			textShadowColor: ACRYLIC.textShadow,
			textShadowOffset: { width: 0, height: 1 },
			textShadowRadius: 4,
		} as TextStyle,
	};
};
