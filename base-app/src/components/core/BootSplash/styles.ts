import { ImageStyle, TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { SPLASH_BUDDY } from "./hooks/useSplashTimeline";

export const SPLASH_COPY = {
	tag: "CORRA COM A SUA EQUIPE",
	bubble: "Bora lá?",
	skip: "Pular abertura",
} as const;

// Logo de 280 × 77 (símbolo à esquerda; PACE e TEAM à direita), a 45% da altura
const LOGO = { w: 280, h: 77 } as const;
const GLOW = 520;

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
		glow: {
			position: "absolute",
			left: "50%",
			top: "45%",
			width: GLOW,
			height: GLOW,
			marginLeft: -GLOW / 2,
			marginTop: -GLOW / 2,
			borderRadius: GLOW / 2,
			backgroundColor: colors.accent,
			opacity: 0.2,
			boxShadow: `0 0 160px 90px ${colors.accent}`,
		} as ViewStyle,
		streak: {
			position: "absolute",
			left: "-40%",
			top: "45%",
			width: "180%",
			height: 2,
			backgroundColor: colors.orange[300],
			transformOrigin: "left center",
		} as ViewStyle,
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
		bubble: {
			position: "absolute",
			right: 104,
			bottom: 150,
			paddingHorizontal: 14,
			paddingVertical: 8,
			borderTopLeftRadius: 16,
			borderTopRightRadius: 16,
			borderBottomLeftRadius: 16,
			borderBottomRightRadius: 4,
			backgroundColor: colors.ink.white,
			transformOrigin: "right bottom",
			boxShadow: "0 8px 20px rgba(0,0,0,.35)",
		} as ViewStyle,
		bubbleText: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 15,
			color: colors.navy[900],
		} as TextStyle,
		buddy: {
			position: "absolute",
			right: 0,
			bottom: SPLASH_BUDDY.bottom,
			width: SPLASH_BUDDY.width,
			height: SPLASH_BUDDY.height,
		} as ViewStyle,
		buddyImage: { width: "100%", height: "100%" } as ImageStyle,
	};
};
