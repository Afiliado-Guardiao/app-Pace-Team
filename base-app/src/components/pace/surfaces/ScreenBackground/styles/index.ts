import { ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { MIST_BLEED, PHOTO_BLEED, PHOTO_OPACITY } from "../constants";
import { IScreenBackgroundStyles } from "../types";

// Camada absoluta que passa das bordas (esconde a borda clara do desfoque)
const bleed = (amount: number): ViewStyle => ({
	position: "absolute",
	top: -amount,
	left: -amount,
	right: -amount,
	bottom: -amount,
});

export const createScreenBackgroundStyles = (theme: ITheme): IScreenBackgroundStyles => {
	const { colors } = theme.pace;

	return {
		root: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			overflow: "hidden",
			backgroundColor: colors.bgScreenBase,
		},
		mistLayer: bleed(MIST_BLEED),
		// brightness(.8) do CSS
		dim: { ...bleed(0), backgroundColor: colors.bgPhotoDim },
		// Foto da tela a 28% em modo luminosidade (a mistura fica no contêiner)
		photoLayer: { ...bleed(PHOTO_BLEED), opacity: PHOTO_OPACITY, mixBlendMode: "luminosity" },
		image: { width: "100%", height: "100%", resizeMode: "cover" },
	};
};
