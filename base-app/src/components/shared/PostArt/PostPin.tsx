import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";

import { ITheme, useTheme } from "@/theme";

interface IPostPinProps {
	// Sem foto: a inicial do nome
	image?: ImageSourcePropType;
	name: string;
	// "Wesley · 1,2 km", embaixo da foto
	label?: string;
	// Posição da ponta do alfinete em % da arte
	x: number;
	y: number;
	// Nome em cima da foto (quando embaixo cobriria outro)
	labelAbove?: boolean;
	cqw: number;
}

const createPostPinStyles = (
	theme: ITheme,
	{ x, y, cqw, labelAbove }: Pick<IPostPinProps, "x" | "y" | "cqw" | "labelAbove">,
) => {
	const { colors } = theme.pace;
	const size = 9 * cqw;
	const arrowHeight = 2 * cqw;
	return {
		root: {
			position: "absolute" as const,
			left: `${String(x)}%` as `${number}%`,
			top: `${String(y)}%` as `${number}%`,
			width: size,
			transform: [{ translateX: -size / 2 }, { translateY: -(size + arrowHeight - 0.4 * cqw) }],
			boxShadow: "0 3px 6px rgba(0,0,0,.4)",
		},
		disc: {
			width: size,
			height: size,
			borderRadius: size / 2,
			padding: 0.7 * cqw,
			backgroundColor: colors.ink.white,
		},
		photo: { width: "100%" as const, height: "100%" as const, borderRadius: size / 2 },
		initial: {
			width: "100%" as const,
			height: "100%" as const,
			borderRadius: size / 2,
			backgroundColor: colors.orange[500],
			textAlign: "center" as const,
			lineHeight: size - 1.4 * cqw,
			fontFamily: theme.pace.typography.fonts.extrabold,
			fontSize: 4 * cqw,
			color: colors.ink.white,
		},
		label: {
			position: "absolute" as const,
			top: labelAbove ? -4.4 * cqw : size + arrowHeight + 0.6 * cqw,
			left: -10 * cqw,
			right: -10 * cqw,
			textAlign: "center" as const,
			fontFamily: theme.pace.typography.fonts.bold,
			fontSize: 2.6 * cqw,
			color: colors.ink.white,
			textShadowColor: colors.navy[950],
			textShadowRadius: 4,
		},
		arrow: {
			alignSelf: "center" as const,
			marginTop: -0.4 * cqw,
			width: 0,
			height: 0,
			borderLeftWidth: 1.6 * cqw,
			borderRightWidth: 1.6 * cqw,
			borderTopWidth: arrowHeight,
			borderLeftColor: colors.transparent,
			borderRightColor: colors.transparent,
			borderTopColor: colors.ink.white,
		},
	};
};

// Alfinete com a foto de quem correu junto, sobre o percurso da arte.
export const PostPin: React.FC<IPostPinProps> = ({ image, name, label, x, y, labelAbove, cqw }) => {
	const { theme } = useTheme();
	const styles = createPostPinStyles(theme, { x, y, cqw, labelAbove });

	return (
		<View style={styles.root} pointerEvents="none">
			<View style={styles.disc}>
				{image ? (
					<Image source={image} style={styles.photo} />
				) : (
					<Text style={styles.initial}>{name.charAt(0).toUpperCase()}</Text>
				)}
			</View>
			<View style={styles.arrow} />
			{label ? <Text style={styles.label}>{label}</Text> : null}
		</View>
	);
};
