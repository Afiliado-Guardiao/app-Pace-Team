import React from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";

import Animated from "react-native-reanimated";

import { Logo, VideoBackground } from "@/components/pace";
import { useTheme } from "@/theme";

import { LOGO_HEIGHT, SPLASH_COPY, SPLASH_VIDEO } from "./constants";
import { useSplashScreen } from "./hooks/useSplashScreen";
import { createSplashStyles } from "./styles";

// 01 Abertura: vídeo da marca, logo, slogan e barra de progresso.
export const SplashScreen: React.FC = () => {
	const { theme } = useTheme();
	const { height } = useWindowDimensions();
	const { logoStyle, sloganStyle, barStyle, handleSkip, handleVideoReady } = useSplashScreen();
	const styles = createSplashStyles(theme, height);

	return (
		<Pressable
			style={styles.root}
			onPress={handleSkip}
			testID="splash-screen"
			accessibilityRole="button"
			accessibilityLabel="Pular abertura"
		>
			<VideoBackground source={SPLASH_VIDEO} scrim="splashScrim" onReady={handleVideoReady} />
			<View style={styles.content}>
				<Animated.View style={logoStyle}>
					<Logo height={LOGO_HEIGHT} />
				</Animated.View>
				<Animated.View style={[styles.slogan, sloganStyle]}>
					<Text style={styles.sloganTop}>{SPLASH_COPY.sloganTop}</Text>
					<Text style={styles.sloganBottom}>{SPLASH_COPY.sloganBottom}</Text>
				</Animated.View>
			</View>
			<View style={styles.track}>
				<Animated.View style={[styles.bar, barStyle]} />
			</View>
		</Pressable>
	);
};
