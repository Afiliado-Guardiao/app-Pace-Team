import { ImageStyle, TextStyle, ViewStyle } from "react-native";

import { BUDDY_H, BUDDY_W } from "@/components/buddy";
import { ITheme } from "@/theme";

import { SPLASH_BUDDY_SCALE } from "./hooks/useSplashTimeline";

export const SPLASH_COPY = {
	tag: "CORRA COM A SUA EQUIPE",
	skip: "Pular abertura",
} as const;

// Logo de 280 × 77 (símbolo à esquerda; PACE e TEAM à direita), a 45% da altura
const LOGO = { w: 280, h: 77 } as const;
// Centro do símbolo (127 de largura) e altura dos pés do Bud na caixa dele
const SYMBOL_CX = 63;
const BUDDY_FEET = 104;

export const createBootSplashStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;
	return {
		root: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: colors.navy[900],
			overflow: "hidden",
		} as ViewStyle,
		fill: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			width: "100%",
			height: "100%",
		} as ViewStyle & ImageStyle,
		logo: {
			position: "absolute",
			left: "50%",
			top: "45%",
			width: LOGO.w,
			height: LOGO.h,
			marginLeft: -LOGO.w / 2,
			marginTop: -LOGO.h / 2,
		} as ViewStyle,
		symbol: {
			position: "absolute",
			left: 0,
			top: 0,
			width: 127,
			height: 77,
			transformOrigin: "left bottom",
		} as ImageStyle,
		paceClip: {
			position: "absolute",
			left: 130,
			top: 19,
			height: 30,
			overflow: "hidden",
		} as ViewStyle,
		pace: { width: 150, height: 30 } as ImageStyle,
		team: {
			position: "absolute",
			left: 130,
			top: 56,
			width: 150,
			height: 20.4,
			transformOrigin: "left center",
		} as ImageStyle,
		tag: {
			position: "absolute",
			left: 0,
			right: 0,
			top: "45%",
			marginTop: 62,
			textAlign: "center",
			fontFamily: typography.fonts.semibold,
			fontSize: 12,
			letterSpacing: 3.8,
			color: colors.textSecondary,
		} as TextStyle,
		// Caixa do Bud (140 × 135 × 82%) com o corpo centrado no símbolo do logo
		buddy: {
			position: "absolute",
			left: "50%",
			top: "45%",
			width: BUDDY_W * SPLASH_BUDDY_SCALE,
			height: BUDDY_H * SPLASH_BUDDY_SCALE,
			marginLeft: -LOGO.w / 2 + SYMBOL_CX - (BUDDY_W * SPLASH_BUDDY_SCALE) / 2,
			marginTop: -LOGO.h / 2 + LOGO.h - BUDDY_FEET * SPLASH_BUDDY_SCALE,
		} as ViewStyle,
		buddyFigure: {
			position: "absolute",
			left: 0,
			top: 0,
			width: BUDDY_W,
			height: BUDDY_H,
			transform: [{ scale: SPLASH_BUDDY_SCALE }],
			transformOrigin: "0% 0%",
		} as ViewStyle,
	};
};
