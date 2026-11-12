import React from "react";
import { Image, View } from "react-native";

import { useTheme } from "@/theme";

import { useLayoutSize } from "../../hooks";
import { GradientLayers } from "../../primitives";

import { DEFAULT_PHOTO, DEFAULT_PHOTO_BLUR } from "./constants";
import { createScreenBackgroundStyles } from "./styles";
import { IScreenBackgroundProps } from "./types";

// Fundo de toda tela PACE (preto e branco): base preta + foto da tela a 28% em
// modo luminosidade (sobre o preto ela fica em tons de cinza) + véu escuro.
export const ScreenBackground: React.FC<IScreenBackgroundProps> = ({
	photo = DEFAULT_PHOTO,
	blur = DEFAULT_PHOTO_BLUR,
}) => {
	const { theme } = useTheme();
	const { size, onLayout } = useLayoutSize();
	const styles = createScreenBackgroundStyles(theme);

	return (
		<View style={styles.root} onLayout={onLayout} pointerEvents="none">
			<View style={styles.dim} />
			<View style={styles.photoLayer}>
				<Image source={photo} style={styles.image} blurRadius={blur} />
			</View>
			{size ? (
				<GradientLayers
					layers={theme.pace.gradients.screenWash}
					width={size.width}
					height={size.height}
				/>
			) : null}
		</View>
	);
};

export * from "./types";
