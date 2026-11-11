import React from "react";
import { Image } from "react-native";

import Animated from "react-native-reanimated";

import { ITheme, useTheme } from "@/theme";

import { ICollagePhoto } from "../../constants";
import { usePhotoPop } from "../../hooks/usePhotoPop";

interface ICollagePhotoProps {
	photo: ICollagePhoto;
	index: number;
	// Escala da colagem (390 de referência → largura da tela)
	k: number;
}

const BORDER = 4;

const createCollagePhotoStyles = (theme: ITheme, photo: ICollagePhoto, k: number) => {
	const radius = photo.isOval ? (Math.min(photo.w, photo.h) * k) / 2 : 14 * k;
	return {
		frame: {
			position: "absolute" as const,
			left: photo.x * k,
			top: photo.y * k,
			width: photo.w * k,
			height: photo.h * k,
			borderRadius: radius,
			borderWidth: BORDER,
			borderColor: theme.pace.colors.textPrimary,
			overflow: "hidden" as const,
			backgroundColor: theme.pace.colors.bgSunken,
			boxShadow: "0 14px 28px -10px rgba(0,0,0,.7)",
		},
		image: { width: "100%" as const, height: "100%" as const },
	};
};

// Uma foto da colagem: moldura branca, inclinada, entra com pop e balança
export const CollagePhoto: React.FC<ICollagePhotoProps> = ({ photo, index, k }) => {
	const { theme } = useTheme();
	const styles = createCollagePhotoStyles(theme, photo, k);
	const pop = usePhotoPop(index, photo.rotate);

	return (
		<Animated.View style={[styles.frame, pop]}>
			<Image source={photo.source} style={styles.image} resizeMode="cover" />
		</Animated.View>
	);
};
