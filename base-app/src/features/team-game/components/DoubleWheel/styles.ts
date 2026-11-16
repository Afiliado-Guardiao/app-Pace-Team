import { ImageStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { HUB } from "../../constants/wheel";

const PIN = 16;
const STICK = { w: 4, h: 30 } as const;

export const createDoubleWheelStyles = (theme: ITheme, size: number) => {
	const { colors } = theme.pace;
	const hub = size * HUB;
	return {
		root: { width: size, height: size, alignSelf: "center" } as ViewStyle,
		layer: { position: "absolute", top: 0, left: 0, width: size, height: size } as ViewStyle,
		glow: {
			position: "absolute",
			top: 0,
			left: 0,
			width: size,
			height: size,
			borderRadius: size / 2,
			boxShadow: `0 0 40px ${colors.accentSoft}`,
		} as ViewStyle,
		hub: {
			position: "absolute",
			left: (size - hub) / 2,
			top: (size - hub) / 2,
			width: hub,
			height: hub,
			borderRadius: hub / 2,
			backgroundColor: colors.bgElevated,
			borderWidth: 1,
			borderColor: colors.glassBorder,
			alignItems: "center",
			justifyContent: "center",
		} as ViewStyle,
		bud: { width: hub * 0.82, height: hub * 0.5 } as ImageStyle,
		stick: {
			position: "absolute",
			top: -STICK.h / 2,
			left: size / 2 - STICK.w / 2,
			width: STICK.w,
			height: STICK.h,
			borderRadius: STICK.w / 2,
			backgroundColor: colors.accent,
		} as ViewStyle,
		pin: {
			position: "absolute",
			top: -STICK.h / 2 - PIN / 2,
			left: size / 2 - PIN / 2,
			width: PIN,
			height: PIN,
			borderRadius: PIN / 2,
			backgroundColor: colors.accent,
			boxShadow: `0 0 14px ${colors.accent}`,
		} as ViewStyle,
		palette: {
			outerA: colors.glassLight,
			outerB: colors.textSecondary,
			outerText: colors.bgSunken,
			innerA: colors.bgElevated,
			innerB: colors.glassDark,
			innerText: colors.textPrimary,
			hit: colors.accent,
			hitText: colors.onAccent,
			line: colors.bgSunken,
			numeric: theme.pace.typography.numericFonts.extrabold,
			numericLight: theme.pace.typography.numericFonts.regular,
			name: theme.pace.typography.fonts.bold,
		},
	};
};

export type IDoubleWheelPalette = ReturnType<typeof createDoubleWheelStyles>["palette"];
