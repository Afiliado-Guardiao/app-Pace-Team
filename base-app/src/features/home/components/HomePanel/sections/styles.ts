import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { ACRYLIC } from "../constants";

// Estilos comuns das seções do painel (k = largura do card / 360)
export const createSectionStyles = (theme: ITheme, k: number) => {
	const { colors, typography } = theme.pace;
	const { fonts, numericFonts } = typography;
	const shadow = {
		textShadowColor: "rgba(0,0,0,.35)",
		textShadowOffset: { width: 0, height: 2 },
		textShadowRadius: 8,
	};
	return {
		root: { flex: 1, paddingHorizontal: 20 * k, paddingBottom: 20 * k } as ViewStyle,
		center: { flex: 1, alignItems: "center", justifyContent: "center" } as ViewStyle,
		title: {
			fontFamily: fonts.bold,
			fontSize: 19 * k,
			color: colors.textPrimary,
			textAlign: "center",
			...shadow,
		} as TextStyle,
		text: {
			fontFamily: fonts.medium,
			fontSize: 13 * k,
			lineHeight: 13 * k * 1.4,
			color: ACRYLIC.white85,
			textAlign: "center",
		} as TextStyle,
		small: { fontFamily: fonts.medium, fontSize: 12 * k, color: ACRYLIC.white85 } as TextStyle,
		strong: { fontFamily: fonts.bold, fontSize: 14 * k, color: colors.textPrimary } as TextStyle,
		number: {
			fontFamily: numericFonts.bold,
			color: colors.textPrimary,
			fontVariant: ["tabular-nums"],
			...shadow,
		} as TextStyle,
		kicker: {
			fontFamily: fonts.bold,
			fontSize: 10 * k,
			letterSpacing: 1.2,
			color: colors.accent,
		} as TextStyle,
		glassBox: {
			flex: 1,
			padding: 12 * k,
			borderRadius: 16,
			backgroundColor: ACRYLIC.glassBox,
			borderWidth: 1,
			borderColor: ACRYLIC.glassBoxBorder,
			gap: 2,
		} as ViewStyle,
		row: { flexDirection: "row", alignItems: "center", gap: 10 * k } as ViewStyle,
		buttons: { flexDirection: "row", gap: 10 * k, marginTop: 12 * k } as ViewStyle,
		dotOnline: {
			width: 8,
			height: 8,
			borderRadius: 4,
			backgroundColor: colors.statusSuccess,
		} as ViewStyle,
	};
};
