import React from "react";
import { Text, TextStyle } from "react-native";

import { useTheme } from "@/theme";

import { STORY } from "../../constants";

export interface IStoryTextProps {
	children: React.ReactNode;
	// Posição como no canvas: x da âncora e y da linha de base
	x: number;
	y: number;
	size: number;
	weight?: 600 | 700 | 800;
	color?: string;
	align?: "left" | "center" | "right";
	spacing?: number;
}

// Da linha de base do Montserrat até o topo da caixa de texto (lineHeight 1,2)
const BASELINE = 0.96;

// Texto posicionado como o fillText do canvas do design (com sombra suave).
export const StoryText: React.FC<IStoryTextProps> = ({
	children,
	x,
	y,
	size,
	weight = 700,
	color,
	align = "left",
	spacing = 0,
}) => {
	const { theme } = useTheme();
	const { colors, typography } = theme.pace;
	const family = {
		600: typography.fonts.semibold,
		700: typography.fonts.bold,
		800: typography.fonts.extrabold,
	}[weight];
	const anchors: Record<typeof align, TextStyle> = {
		left: { left: x },
		right: { right: STORY.width - x, textAlign: "right" },
		// Caixa da largura do story centrada em x (o web limita a largura ao pai)
		center: { left: x - STORY.width / 2, width: STORY.width, textAlign: "center" },
	};
	const anchor = anchors[align];

	return (
		<Text
			numberOfLines={1}
			style={[
				{
					position: "absolute",
					top: y - size * BASELINE,
					fontFamily: family,
					fontSize: size,
					lineHeight: size * 1.2,
					letterSpacing: spacing,
					color: color ?? colors.ink.white,
					textShadowColor: colors.storyTextShadow,
					textShadowOffset: { width: 0, height: 0 },
					textShadowRadius: 18,
				},
				anchor,
			]}
		>
			{children}
		</Text>
	);
};
