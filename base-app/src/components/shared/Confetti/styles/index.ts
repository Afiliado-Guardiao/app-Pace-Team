import { ViewStyle } from "react-native";

import { CSSAnimationKeyframes } from "react-native-reanimated";

import { ITheme } from "@/theme";

const PIECES = 36;
// Posição, atraso, giro e tamanho de cada papel (fixos: o desenho não pisca)
export const CONFETTI_PIECES = Array.from({ length: PIECES }, (_, i) => ({
	left: `${String((i * 37) % 100)}%` as `${number}%`,
	delay: `${String(((i * 53) % 900) / 1000)}s` as `${number}s`,
	spin: (i % 2 ? 1 : -1) * (360 + ((i * 47) % 360)),
	w: 6 + (i % 3) * 2,
	h: 10 + (i % 4) * 2,
}));

type IPiece = (typeof CONFETTI_PIECES)[number];

const fall = (height: number, spin: number): CSSAnimationKeyframes => ({
	"0%": { opacity: 1, transform: [{ translateY: -30 }, { rotate: "0deg" }] },
	"80%": { opacity: 1 },
	"100%": { opacity: 0, transform: [{ translateY: height }, { rotate: `${String(spin)}deg` }] },
});

export const createConfettiStyles = (theme: ITheme, height: number) => {
	const { colors } = theme.pace;
	const palette = [colors.orange[500], colors.orange[300], colors.statusSuccess, colors.ink.white];
	const box: ViewStyle = {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height,
		overflow: "hidden",
	};
	const piece = (p: IPiece, i: number) =>
		({
			position: "absolute",
			top: 0,
			left: p.left,
			width: p.w,
			height: p.h,
			borderRadius: 2,
			backgroundColor: palette[i % palette.length],
			animationName: fall(height, p.spin),
			animationDuration: "2.4s",
			animationDelay: p.delay,
			animationTimingFunction: "ease-in",
			animationIterationCount: 1,
			animationFillMode: "both",
		}) as const;
	return { box, piece };
};
