import React from "react";
import { Image, ImageSourcePropType, View } from "react-native";

import { ITheme, useTheme } from "@/theme";

interface IPostPinProps {
	image: ImageSourcePropType;
	// Posição da ponta do alfinete em % da arte
	x: number;
	y: number;
	cqw: number;
}

const createPostPinStyles = (theme: ITheme, { x, y, cqw }: Omit<IPostPinProps, "image">) => {
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
export const PostPin: React.FC<IPostPinProps> = ({ image, x, y, cqw }) => {
	const { theme } = useTheme();
	const styles = createPostPinStyles(theme, { x, y, cqw });

	return (
		<View style={styles.root} pointerEvents="none">
			<View style={styles.disc}>
				<Image source={image} style={styles.photo} />
			</View>
			<View style={styles.arrow} />
		</View>
	);
};
