import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { useTheme } from "@/theme";

import buddyWave from "../../../../assets/brand/splash/buddy-wave.png";
import logoPace from "../../../../assets/brand/splash/logo-pace.png";
import logoSymbol from "../../../../assets/brand/splash/logo-symbol.png";
import logoTeam from "../../../../assets/brand/splash/logo-team.png";
import splashNavy from "../../../../assets/brand/splash-navy.png";

import { useBootSplash } from "./hooks/useBootSplash";
import { createBootSplashStyles, SPLASH_COPY } from "./styles";

// Abertura: o símbolo se encaixa, "PACE" surge da esquerda,
// "TEAM" assenta e o Buddy espia pela lateral dizendo "Bora lá?".
export const BootSplash: React.FC = () => {
	const { theme } = useTheme();
	const { isVisible, styles: anim, skip } = useBootSplash();
	const styles = createBootSplashStyles(theme);
	if (!isVisible) return null;

	return (
		<Animated.View style={[styles.root, anim.screen]} testID="boot-splash">
			<Pressable
				style={styles.fill}
				onPress={skip}
				accessibilityLabel={SPLASH_COPY.skip}
				testID="boot-splash-skip"
			>
				<Image source={splashNavy} style={styles.fill} resizeMode="cover" />
				<Animated.View style={[styles.logo, anim.logo]}>
					<Animated.Image
						source={logoSymbol}
						style={[styles.symbol, anim.symbol]}
						resizeMode="contain"
					/>
					<Animated.View style={[styles.paceClip, anim.paceClip]}>
						<Image source={logoPace} style={styles.pace} resizeMode="contain" />
					</Animated.View>
					<Animated.Image source={logoTeam} style={[styles.team, anim.team]} resizeMode="contain" />
				</Animated.View>
				<Animated.Text style={[styles.tag, anim.tag]}>{SPLASH_COPY.tag}</Animated.Text>
				<Animated.View style={[styles.bubble, anim.bubble]}>
					<Text style={styles.bubbleText}>{SPLASH_COPY.bubble}</Text>
				</Animated.View>
				<Animated.View style={[styles.buddy, anim.buddy]}>
					<Image source={buddyWave} style={styles.buddyImage} resizeMode="contain" />
				</Animated.View>
				<View style={styles.fill} pointerEvents="none" />
			</Pressable>
		</Animated.View>
	);
};
