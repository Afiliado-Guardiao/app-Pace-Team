import React from "react";
import { Image, ImageSourcePropType, StyleSheet } from "react-native";

import Animated from "react-native-reanimated";

import { useSlideFade } from "../../hooks/useSlideFade";

interface ISlidePhotoProps {
	image: ImageSourcePropType;
	isVisible: boolean;
}

// Ocupa a tela toda: na web, sem largura/altura explícitas a foto ficaria no
// tamanho original (aparecia ampliada, só o canto de cima à esquerda)
const PHOTO_STYLE = { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" } as const;

// Foto de tela cheia de um slide; aparece e some com fade.
export const SlidePhoto: React.FC<ISlidePhotoProps> = ({ image, isVisible }) => {
	const fade = useSlideFade(isVisible);

	return (
		<Animated.View style={[StyleSheet.absoluteFill, fade]} pointerEvents="none">
			<Image
				source={image}
				resizeMode="cover"
				style={PHOTO_STYLE}
				accessibilityIgnoresInvertColors
			/>
		</Animated.View>
	);
};
