import React from "react";
import { Image, ImageSourcePropType, View } from "react-native";

import { ITheme, useTheme } from "@/theme";

interface IStoryPinProps {
	image: ImageSourcePropType;
	// Ponta do alfinete no percurso
	x: number;
	y: number;
	radius?: number;
}

const RING = 7;
const STEM = 26;
const ARROW_HALF = 18;
const ARROW_HEIGHT = 20;
const DOT = 24;
const DOT_BORDER = 4;

const createStoryPinStyles = (
	theme: ITheme,
	{ x, y, radius }: { x: number; y: number; radius: number },
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
			left: x - DOT / 2,
			top: y - DOT / 2,
			width: DOT,
			height: DOT,
			borderRadius: DOT / 2,
			borderWidth: DOT_BORDER,
			borderColor: colors.ink.white,
			backgroundColor: colors.accent,
		},
	};
};

// Alfinete com foto de quem correu junto, como o avatarPin do canvas.
export const StoryPin: React.FC<IStoryPinProps> = ({ image, x, y, radius = 54 }) => {
	const { theme } = useTheme();
	const styles = createStoryPinStyles(theme, { x, y, radius });

	return (
		<>
			<View style={styles.ring} />
			<View style={styles.arrow} />
			<Image source={image} style={styles.photo} />
			<View style={styles.dot} />
		</>
	);
};
