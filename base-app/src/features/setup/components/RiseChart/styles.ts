import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { RISE, RISE_TEXT as T, TROPHY } from "./geometry";

// Margem das etapas (a arte vai de ponta a ponta, como no rascunho)
export const BLEED = 22;

export const createRiseChartStyles = (theme: ITheme, s: number) => {
	const { colors, typography } = theme.pace;
	const at = (x: number, y: number): ViewStyle => ({
		position: "absolute",
		left: x * s,
		top: y * s,
	});
	const small = (size: number, color: string): TextStyle => ({
		fontFamily: typography.fonts.bold,
		fontSize: size * s,
		letterSpacing: 2.4 * s,
		color,
	});
	return {
		root: { marginHorizontal: -BLEED, width: RISE.w * s, height: RISE.h * s } as ViewStyle,
		svg: { position: "absolute", left: 0, top: 0 } as ViewStyle,
		title: {
			...at(T.title.x, T.title.y),
			fontFamily: typography.fonts.extrabold,
			fontSize: T.title.size * s,
			lineHeight: T.title.line * s,
			letterSpacing: 0.8 * s,
			color: colors.textPrimary,
		} as TextStyle,
		sub: {
			...at(T.sub.x, T.sub.y),
			fontFamily: typography.fonts.regular,
			fontSize: T.sub.size * s,
			color: colors.textMuted,
		} as TextStyle,
		dayOne: { ...at(T.ends.x, T.ends.y), ...small(T.ends.size, colors.textMuted) } as TextStyle,
		monthTwo: {
			position: "absolute",
			right: T.ends.right * s,
			top: T.ends.y * s,
			...small(T.ends.size, colors.textMuted),
		} as TextStyle,
		// "EVOLUÇÃO" de pé, centrado no ponto do rascunho
		axis: {
			position: "absolute",
			left: (T.axis.x - 60) * s,
			top: (T.axis.y - 10) * s,
			width: 120 * s,
			textAlign: "center",
			transform: [{ rotate: "-90deg" }],
			...small(T.axis.size, colors.textMuted),
		} as TextStyle,
		legend: {
			...at(T.legend.x, T.legend.y),
			...small(T.legend.size, colors.textPrimary),
		} as TextStyle,
		legendMuted: {
			position: "absolute",
			right: T.legend.right * s,
			top: T.legend.y * s,
			...small(T.legend.size, colors.textMuted),
		} as TextStyle,
		note: {
			position: "absolute",
			left: 0,
			right: 0,
			top: T.note.y * s,
			textAlign: "center",
			fontFamily: typography.fonts.regular,
			fontSize: T.note.size * s,
			color: colors.textDisabled,
		} as TextStyle,
		glow: {
			position: "absolute",
			left: (TROPHY.x - TROPHY.r * 1.9) * s,
			top: (TROPHY.y - TROPHY.r * 1.9) * s,
			width: TROPHY.r * 3.8 * s,
			height: TROPHY.r * 3.8 * s,
			borderRadius: TROPHY.r * 1.9 * s,
			backgroundColor: colors.trophyGlow,
			boxShadow: `0 0 ${String(22 * s)}px ${colors.trophyGlow}`,
		} as ViewStyle,
		trophy: {
			position: "absolute",
			left: (TROPHY.x - TROPHY.r) * s,
			top: (TROPHY.y - TROPHY.r) * s,
			width: TROPHY.r * 2 * s,
			height: TROPHY.r * 2 * s,
			borderRadius: TROPHY.r * s,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: colors.trophyGold,
		} as ViewStyle,
		colors,
	};
};
