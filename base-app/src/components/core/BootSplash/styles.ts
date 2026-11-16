import { ImageStyle, ViewStyle } from "react-native";

import { BUDDY_H, BUDDY_W, EASE_SPRING } from "@/components/buddy";
import { ITheme } from "@/theme";

import { ISplashPhase } from "./hooks/useBootSplash";

export const SPLASH_COPY = {
	skip: "Pular abertura",
	loading: "Carregando…",
} as const;

// Logo escrito do mesmo tamanho da abertura nativa (62% da largura,
// splash-black.png); proporção do logo-wordmark.png (1659 x 215)
const SYMBOL_K = 0.62;
const SYMBOL_RATIO = 215 / 1659;
export const SPLASH_BUD_SCALE = 1.1;

const symbolOpacity = (phase: ISplashPhase): number => {
	if (phase === "logo") return 0.35;
	if (phase === "bright") return 1;
	return 0;
};

export const createBootSplashStyles = (theme: ITheme, width: number, phase: ISplashPhase) => {
	const symbolW = width * SYMBOL_K;
	const budW = BUDDY_W * SPLASH_BUD_SCALE;
	const budH = BUDDY_H * SPLASH_BUD_SCALE;
	const isBudIn = phase !== "logo" && phase !== "bright";
	return {
		root: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: theme.pace.colors.bgSunken,
			overflow: "hidden",
			opacity: phase === "out" ? 0 : 1,
			transitionProperty: "opacity",
			transitionDuration: "0.3s",
		} as ViewStyle,
		fill: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 } as ViewStyle,
		// Surge cinza (como a abertura nativa) e acende branco
		symbol: {
			position: "absolute",
			left: "50%",
			top: "50%",
			width: symbolW,
			height: symbolW * SYMBOL_RATIO,
			marginLeft: -symbolW / 2,
			marginTop: -(symbolW * SYMBOL_RATIO) / 2,
			opacity: symbolOpacity(phase),
			transform: [{ scale: phase === "bright" ? 1 : 0.96 }],
			transitionProperty: ["opacity", "transform"],
			transitionDuration: phase === "run" ? "0.25s" : "0.45s",
		} as ImageStyle,
		// O Bud entra correndo da esquerda e para no meio
		bud: {
			position: "absolute",
			left: "50%",
			top: "50%",
			marginLeft: -budW / 2,
			marginTop: -budH / 2,
			opacity: isBudIn ? 1 : 0,
			transform: [{ translateX: isBudIn ? 0 : -width }],
			transitionProperty: ["transform", "opacity"],
			transitionDuration: "0.6s",
			transitionTimingFunction: EASE_SPRING,
		} as ViewStyle,
	};
};
