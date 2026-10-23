import { ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { IGlassAppearance, IGlassSurfaceStyles } from "../types";

const cornerStyle = (top: number, bottom: number): ViewStyle => ({
	borderTopLeftRadius: top,
	borderTopRightRadius: top,
	borderBottomLeftRadius: bottom,
	borderBottomRightRadius: bottom,
});

// Camadas na ordem do CSS: sombra externa → desfoque + preenchimento (recortados
// no raio, cobrindo também a borda) → borda + brilho interno → conteúdo → rim.
export const createGlassSurfaceStyles = (
	theme: ITheme,
	appearance: IGlassAppearance,
	radius: number,
): IGlassSurfaceStyles => {
	const { colors, borders, shadows } = theme.pace;
	const bottomRadius = appearance.bottomRadius ?? radius;
	const hasBorder = appearance.border !== null;
	const borderWidth = hasBorder ? (appearance.borderWidth ?? borders.hairline) : 0;
	const solidColor =
		appearance.fill && typeof appearance.fill === "object"
			? appearance.fill.color
			: colors.transparent;
	const bleed = -borderWidth;
	const shape = cornerStyle(radius, bottomRadius);
	// zIndex: as camadas de vidro ficam atrás do conteúdo também na web, onde
	// elementos posicionados seriam pintados por cima de ícones e textos
	const fill: ViewStyle = {
		zIndex: -1,
		position: "absolute",
		top: bleed,
		left: bleed,
		right: bleed,
		bottom: bleed,
	};

	return {
		root: {
			position: "relative",
			zIndex: 0,
			...shape,
			borderWidth,
			borderColor: colors.transparent,
			boxShadow: appearance.outerShadow ?? shadows.none,
		},
		clip: { ...fill, ...shape, overflow: "hidden" },
		solid: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: solidColor,
		},
		overlay: {
			...fill,
			...shape,
			borderWidth,
			// Folha inferior (Sheet) não tem borda embaixo
			borderBottomWidth: appearance.openBottom ? 0 : borderWidth,
			borderColor: appearance.border ?? colors.transparent,
			boxShadow: appearance.innerShadow ?? shadows.none,
		},
		borderWidth,
		bottomRadius,
	};
};
