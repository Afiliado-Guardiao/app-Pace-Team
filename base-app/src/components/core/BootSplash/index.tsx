import React from "react";
import { Pressable, useWindowDimensions } from "react-native";

import Animated from "react-native-reanimated";

import { BuddyDots } from "@/components/buddy";
import { useTheme } from "@/theme";

import logoOld from "../../../../assets/brand/splash/logo-old.png";
import logoWordmark from "../../../../assets/brand/splash/logo-wordmark.png";

import { useBootSplash } from "./hooks/useBootSplash";
import { createBootSplashStyles, SPLASH_BUD_SCALE, SPLASH_COPY } from "./styles";

// Abertura (preto e branco): o logo antigo vai quase se apagando, o logo
// "PACE [Bud] TEAM" surge apagado e acende,
// some e o Bud de verdade chega correndo, vira as três bolinhas do carregamento e, com o app pronto,
// volta a ser o Bud acenando. Tocar pula.
export const BootSplash: React.FC = () => {
	const { theme } = useTheme();
	const { width } = useWindowDimensions();
	const splash = useBootSplash();
	const styles = createBootSplashStyles(theme, width, splash.phase);
	if (!splash.isVisible) return null;

	return (
		<Animated.View style={styles.root} testID="boot-splash">
			<Pressable
				style={styles.fill}
				onPress={splash.skip}
				accessibilityLabel={SPLASH_COPY.skip}
				testID="boot-splash-skip"
			>
				<Animated.Image source={logoOld} style={styles.old} resizeMode="contain" />
				<Animated.Image source={logoWordmark} style={styles.symbol} resizeMode="contain" />
				<Animated.View style={styles.bud} pointerEvents="none">
					<BuddyDots
						mode={splash.mode}
						pose={splash.pose}
						scale={SPLASH_BUD_SCALE}
						label={SPLASH_COPY.loading}
					/>
				</Animated.View>
			</Pressable>
		</Animated.View>
	);
};
