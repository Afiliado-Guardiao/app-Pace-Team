import React from "react";
import { Image } from "react-native";

import Animated from "react-native-reanimated";

import { Logo } from "@/components/pace";
import { useTheme } from "@/theme";

import splashPhoto from "../../../../assets/brand/splash-photo.jpg";

import { useBootSplash } from "./hooks/useBootSplash";
import { createBootSplashStyles } from "./styles";

const LOGO_HEIGHT = 74;

// Foto dos corredores e logo por cima de tudo enquanto o app carrega.
export const BootSplash: React.FC = () => {
	const { theme } = useTheme();
	const { isVisible, screenStyle, logoStyle, handleImageReady } = useBootSplash();
	const styles = createBootSplashStyles(theme);
	if (!isVisible) return null;

	return (
		<Animated.View style={[styles.root, screenStyle]} testID="boot-splash">
			<Image
				source={splashPhoto}
				style={styles.photo}
				resizeMode="cover"
				onLoad={handleImageReady}
			/>
			<Animated.View style={[styles.logo, logoStyle]}>
				<Logo height={LOGO_HEIGHT} />
			</Animated.View>
		</Animated.View>
	);
};
