import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { ACRYLIC } from "../constants";

// Estilos das miniaturas das telas do Pro (PACE AI, Água, Studio, Analytics)
export const createProPreviewStyles = (theme: ITheme, k: number) => {
	const { colors, typography } = theme.pace;
	const { fonts, numericFonts } = typography;
	const glass: ViewStyle = {
		backgroundColor: ACRYLIC.glassBox,
		borderWidth: 1,
		borderColor: ACRYLIC.glassBoxBorder,
	};
	return {
		stack: { gap: 6 * k } as ViewStyle,
		center: { alignItems: "center", justifyContent: "center" } as ViewStyle,
		row: { flexDirection: "row", alignItems: "center", gap: 6 * k } as ViewStyle,
		baseline: { alignItems: "baseline" } as ViewStyle,
		abs: { position: "absolute", left: 0, top: 0 } as ViewStyle,
		speech: {
			flex: 1,
			paddingHorizontal: 10 * k,
			paddingVertical: 8 * k,
			borderRadius: 14,
			backgroundColor: "#F5F5F7",
		} as ViewStyle,
		speechText: {
			fontFamily: fonts.bold,
			fontSize: 12 * k,
			lineHeight: 15 * k,
			color: "#111",
		} as TextStyle,
		chip: {
			...glass,
			alignSelf: "flex-start",
			paddingHorizontal: 12 * k,
			paddingVertical: 6 * k,
			borderRadius: 999,
		} as ViewStyle,
		chipText: {
			fontFamily: fonts.semibold,
			fontSize: 11 * k,
			color: colors.textPrimary,
		} as TextStyle,
		ring: { alignItems: "center", justifyContent: "center", gap: 2 } as ViewStyle,
		ringTrack: { color: "rgba(255,255,255,.14)" },
		ringText: {
			fontFamily: fonts.semibold,
			fontSize: 10 * k,
			color: ACRYLIC.white85,
		} as TextStyle,
		cup: {
			...glass,
			flexDirection: "row",
			alignItems: "center",
			gap: 4,
			paddingHorizontal: 9 * k,
			paddingVertical: 6 * k,
			borderRadius: 999,
		} as ViewStyle,
		grid: {
			flexDirection: "row",
			flexWrap: "wrap",
			justifyContent: "center",
			gap: 6 * k,
		} as ViewStyle,
		tile: {
			...glass,
			width: 92 * k,
			height: 74 * k,
			borderRadius: 14,
			alignItems: "center",
			justifyContent: "flex-end",
			paddingBottom: 5 * k,
			gap: 2,
		} as ViewStyle,
		badge: {
			position: "absolute",
			right: 5,
			top: 5,
			paddingHorizontal: 5,
			paddingVertical: 1,
			borderRadius: 999,
			backgroundColor: colors.accent,
		} as ViewStyle,
		badgeText: { fontFamily: fonts.extrabold, fontSize: 8, color: "#fff" } as TextStyle,
		tileText: {
			fontFamily: fonts.semibold,
			fontSize: 10 * k,
			color: colors.textPrimary,
		} as TextStyle,
		kicker: {
			fontFamily: fonts.bold,
			fontSize: 10 * k,
			letterSpacing: 1.4,
			color: colors.textSecondary,
		} as TextStyle,
		teamName: { fontFamily: fonts.bold, fontSize: 16 * k, color: colors.textPrimary } as TextStyle,
		bigNumber: {
			fontFamily: numericFonts.bold,
			fontSize: 34 * k,
			color: colors.textPrimary,
		} as TextStyle,
		bars: {
			flexDirection: "row",
			alignItems: "flex-end",
			justifyContent: "space-between",
			marginTop: 4 * k,
		} as ViewStyle,
		barCol: { alignItems: "center", gap: 3 } as ViewStyle,
		bar: {
			width: 16 * k,
			borderRadius: 8 * k,
			backgroundColor: "rgba(255,255,255,.28)",
		} as ViewStyle,
		barNow: { backgroundColor: colors.accent } as ViewStyle,
		barLabel: {
			fontFamily: fonts.medium,
			fontSize: 8 * k,
			color: colors.textSecondary,
		} as TextStyle,
	};
};
