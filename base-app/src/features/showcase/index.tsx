import React from "react";
import { Pressable, Text, View } from "react-native";

import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { ITheme, useTheme } from "@/theme";

import { BuddyHero } from "./components/BuddyHero";
import { CollagePhoto } from "./components/CollagePhoto";
import { COLLAGE, SHOWCASE_COPY as C } from "./constants";
import { useShowcase } from "./hooks/useShowcase";

const createShowcaseStyles = (theme: ITheme, collageH: number, k: number) => {
	const { colors, spacing, typography, radii } = theme.pace;
	return {
		root: { flex: 1, backgroundColor: colors.bgSunken },
		safe: { flex: 1, justifyContent: "space-between" as const, paddingBottom: spacing[4] },
		collage: { height: collageH, marginTop: spacing[2] },
		words: { alignItems: "center" as const },
		soft: {
			fontFamily: typography.fonts.bold,
			fontSize: 30 * k,
			lineHeight: 36 * k,
			color: colors.textTertiary,
		},
		strong: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 30 * k,
			lineHeight: 36 * k,
			color: colors.textPrimary,
		},
		bottom: { paddingHorizontal: spacing[5], gap: spacing[4], alignItems: "center" as const },
		cta: {
			alignSelf: "stretch" as const,
			height: Math.max(48, 60 * k),
			borderRadius: radii.pill,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: colors.textPrimary,
		},
		ctaText: { fontFamily: typography.fonts.bold, fontSize: 17, color: colors.textOnLight },
		login: { fontFamily: typography.fonts.semibold, fontSize: 15, color: colors.textPrimary },
	};
};

// 01 · boas-vindas do onboarding: colagem de fotos de corrida e de equipe,
// o Buddy acenando e "Cada corrida. Cada km. Juntos."
export const ShowcaseScreen: React.FC = () => {
	const { theme } = useTheme();
	const show = useShowcase();
	const styles = createShowcaseStyles(theme, show.collageH, show.k);

	return (
		<View style={styles.root}>
			<SafeAreaView style={styles.safe}>
				<View style={styles.collage}>
					{COLLAGE.map((photo, i) => (
						<CollagePhoto key={i} photo={photo} index={i} k={show.k} />
					))}
				</View>
				<BuddyHero pose={show.pose} k={show.k} />
				<Animated.View entering={FadeInUp.delay(1000).duration(600)} style={styles.words}>
					<Text style={styles.soft}>{C.lineA}</Text>
					<Text style={styles.soft}>{C.lineB}</Text>
					<Text style={styles.strong}>{C.lineC}</Text>
				</Animated.View>
				<Animated.View entering={FadeInUp.delay(1300).duration(600)} style={styles.bottom}>
					<Pressable
						style={({ pressed }) => [styles.cta, pressed ? { opacity: 0.85 } : null]}
						onPress={show.start}
						accessibilityRole="button"
						accessibilityLabel={C.cta}
						testID="showcase-start"
					>
						<Text style={styles.ctaText}>{C.cta}</Text>
					</Pressable>
					<Text
						style={styles.login}
						onPress={show.login}
						accessibilityRole="link"
						testID="showcase-login"
					>
						{C.login}
					</Text>
				</Animated.View>
			</SafeAreaView>
		</View>
	);
};
