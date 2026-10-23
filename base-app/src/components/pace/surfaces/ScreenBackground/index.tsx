import React from "react";
import { Image, View } from "react-native";

import { useTheme } from "@/theme";

import { useLayoutSize } from "../../hooks";
import { GradientLayers } from "../../primitives";

import { BACKGROUND_MIST, DEFAULT_PHOTO, DEFAULT_PHOTO_BLUR, MIST_BLUR } from "./constants";
import { createScreenBackgroundStyles } from "./styles";
import { IScreenBackgroundProps } from "./types";

// Fundo de toda tela PACE (ScreenBg): névoa azul desfocada + foto da tela a 28%
// em luminosidade + véu ardósia vertical. Nunca um fundo chapado.
export const ScreenBackground: React.FC<IScreenBackgroundProps> = ({
	photo = DEFAULT_PHOTO,
	blur = DEFAULT_PHOTO_BLUR,
}) => {
	const { theme } = useTheme();
	const { size, onLayout } = useLayoutSize();
	const styles = createScreenBackgroundStyles(theme);

	return (
		<View style={styles.root} onLayout={onLayout} pointerEvents="none">
			<View style={styles.mistLayer}>
				<Image source={BACKGROUND_MIST} style={styles.image} blurRadius={MIST_BLUR} />
			</View>
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
