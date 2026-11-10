import React from "react";
import { Image, Pressable, View } from "react-native";

import Animated from "react-native-reanimated";

import { BuddyFigure } from "@/components/buddy";
import { useTheme } from "@/theme";

import logoPace from "../../../../assets/brand/splash/logo-pace.png";
import logoSymbol from "../../../../assets/brand/splash/logo-symbol.png";
import logoTeam from "../../../../assets/brand/splash/logo-team.png";
import splashNavy from "../../../../assets/brand/splash-navy.png";

import { useBootSplash } from "./hooks/useBootSplash";
import { createBootSplashStyles, SPLASH_COPY } from "./styles";

// Abertura: o logo entra, o Bud chega correndo da esquerda com o anel
// laranja, para em cima do símbolo e vai vestindo acessórios até o app
// carregar; aí sai correndo para a direita e o Início aparece.
export const BootSplash: React.FC = () => {
	const { theme } = useTheme();
	const { isVisible, isStill, styles: anim, buddy, skip } = useBootSplash();
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
				<View style={styles.logo}>
					<Animated.Image
						source={logoSymbol}
						style={[styles.symbol, anim.symbol]}
						resizeMode="contain"
					/>
					<Animated.View style={[styles.paceClip, anim.paceClip]}>
						<Image source={logoPace} style={styles.pace} resizeMode="contain" />
					</Animated.View>
					<Animated.Image source={logoTeam} style={[styles.team, anim.team]} resizeMode="contain" />
				</View>
				<Animated.Text style={[styles.tag, anim.tag]}>{SPLASH_COPY.tag}</Animated.Text>
				{isStill ? null : (
					<Animated.View style={[styles.buddy, anim.buddy]} pointerEvents="none">
						<View style={styles.buddyFigure}>
							<BuddyFigure
								pose={buddy.pose}
								color="branco"
								accessories={buddy.accessories}
								dropId={buddy.dropId}
							/>
						</View>
					</Animated.View>
				)}
				<View style={styles.fill} pointerEvents="none" />
			</Pressable>
		</Animated.View>
	);
};
