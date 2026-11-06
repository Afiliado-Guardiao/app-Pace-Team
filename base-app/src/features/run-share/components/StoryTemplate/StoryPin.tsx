import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";

import { ITheme, useTheme } from "@/theme";

interface IStoryPinProps {
	// Sem foto: a inicial do nome
	image?: ImageSourcePropType;
	name: string;
	// "Wesley · 1,2 km", embaixo do ponto
	label?: string;
	// Ponta do alfinete no percurso
	x: number;
	y: number;
	// Nome em cima da foto (quando embaixo cobriria outro)
	labelAbove?: boolean;
	// Ponto no percurso, quando a foto foi afastada para o lado
	dotX?: number;
	dotY?: number;
	radius?: number;
}

const RING = 7;
const STEM = 26;
const ARROW_HALF = 18;
const ARROW_HEIGHT = 20;
const DOT = 24;
const DOT_BORDER = 4;
const LABEL_W = 380;
const LABEL_GAP = 10;
const LABEL_H = 40;

const createStoryPinStyles = (
	theme: ITheme,
	{
		x,
		y,
		radius,
		labelAbove,
		dot: [dotX, dotY],
	}: { x: number; y: number; radius: number; labelAbove: boolean; dot: [number, number] },
) => {
	const { colors } = theme.pace;
	const top = y - radius * 2 - STEM;
	const outer = radius + RING;
	return {
		ring: {
			position: "absolute" as const,
			left: x - outer,
			top: top + radius - outer,
			width: outer * 2,
			height: outer * 2,
			borderRadius: outer,
			backgroundColor: colors.ink.white,
			boxShadow: "0 6px 22px rgba(0,0,0,.45)",
		},
		arrow: {
			position: "absolute" as const,
			left: x - ARROW_HALF,
			top: top + radius * 2 + 2,
			width: 0,
			height: 0,
			borderLeftWidth: ARROW_HALF,
			borderRightWidth: ARROW_HALF,
			borderTopWidth: ARROW_HEIGHT,
			borderLeftColor: colors.transparent,
			borderRightColor: colors.transparent,
			borderTopColor: colors.ink.white,
		},
		photo: {
			position: "absolute" as const,
			left: x - radius,
			top,
			width: radius * 2,
			height: radius * 2,
			borderRadius: radius,
		},
		dot: {
			position: "absolute" as const,
			left: dotX - DOT / 2,
			top: dotY - DOT / 2,
			width: DOT,
			height: DOT,
			borderRadius: DOT / 2,
			borderWidth: DOT_BORDER,
			borderColor: colors.ink.white,
			backgroundColor: colors.accent,
		},
		initial: {
			position: "absolute" as const,
			left: x - radius,
			top,
			width: radius * 2,
			height: radius * 2,
			borderRadius: radius,
			backgroundColor: colors.orange[500],
			textAlign: "center" as const,
			lineHeight: radius * 2,
			fontFamily: theme.pace.typography.fonts.extrabold,
			fontSize: radius,
			color: colors.ink.white,
		},
		label: {
			position: "absolute" as const,
			left: x - LABEL_W / 2,
			top: labelAbove ? top - RING - LABEL_GAP - LABEL_H : y + DOT / 2 + LABEL_GAP,
			width: LABEL_W,
			textAlign: "center" as const,
			fontFamily: theme.pace.typography.fonts.bold,
			fontSize: 30,
			color: colors.ink.white,
			textShadowColor: colors.navy[950],
			textShadowRadius: 8,
		},
	};
};

// Alfinete com foto de quem correu junto, como o avatarPin do canvas.
export const StoryPin: React.FC<IStoryPinProps> = ({
	image,
	name,
	label,
	x,
	y,
	labelAbove = false,
	dotX,
	dotY,
	radius = 54,
}) => {
	const { theme } = useTheme();
	const dot: [number, number] = [dotX ?? x, dotY ?? y];
	const styles = createStoryPinStyles(theme, { x, y, radius, labelAbove, dot });

	return (
		<>
			<View style={styles.ring} />
			<View style={styles.arrow} />
			{image ? (
				<Image source={image} style={styles.photo} />
			) : (
				<Text style={styles.initial}>{name.charAt(0).toUpperCase()}</Text>
			)}
			<View style={styles.dot} />
			{label ? <Text style={styles.label}>{label}</Text> : null}
		</>
	);
};
