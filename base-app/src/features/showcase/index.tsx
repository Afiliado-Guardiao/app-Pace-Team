import React from "react";
import { Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { Button, Logo, ScreenBackground, ScreenScroll } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { SceneTag } from "./components/SceneTag";
import { ShowcasePhone } from "./components/ShowcasePhone";
import { SHOWCASE_COPY as C } from "./constants";
import { useShowcase } from "./hooks/useShowcase";

const GLOW = 300;

const createShowcaseStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { flex: 1 },
		content: { alignItems: "center" as const, gap: spacing[4], paddingTop: spacing[2] },
		stage: { alignItems: "center" as const, justifyContent: "center" as const },
		glow: {
			position: "absolute" as const,
			width: GLOW,
			height: GLOW,
			borderRadius: GLOW / 2,
			backgroundColor: "rgba(253,90,12,.22)",
			boxShadow: "0 0 90px 30px rgba(253,90,12,.30)",
		},
		tag: { alignSelf: "stretch" as const },
		lineA: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 32,
			color: colors.textPrimary,
			textAlign: "center" as const,
		},
		lineB: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 32,
			color: colors.orange[400],
			textAlign: "center" as const,
			marginTop: -6,
		},
		sub: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			lineHeight: 21,
			color: colors.textSecondary,
			textAlign: "center" as const,
		},
		cta: { alignSelf: "stretch" as const },
		link: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.ui,
			color: colors.textSecondary,
			textDecorationLine: "underline" as const,
		},
	};
};

// 01 · Welcome: o celular de vitrine mostra o app de verdade, cena por cena
export const ShowcaseScreen: React.FC = () => {
	const { theme } = useTheme();
	const styles = createShowcaseStyles(theme);
	const show = useShowcase();

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.blueMist} />
			<ScreenScroll contentStyle={styles.content}>
				<Logo variant="white" height={26} />
				<View style={styles.stage}>
					<View style={styles.glow} />
					<Animated.View style={show.phone}>
						<ShowcasePhone scene={show.scene} />
					</Animated.View>
				</View>
				<View style={styles.tag}>
					<SceneTag scene={show.scene} index={show.index} />
				</View>
				<View>
					<Text style={styles.lineA}>{C.lineA}</Text>
					<Text style={styles.lineB}>{C.lineB}</Text>
				</View>
				<Text style={styles.sub}>{C.sub}</Text>
				<View style={styles.cta}>
					<Button
						size="lg"
						fullWidth
						iconRight="chevron-right"
						onPress={show.start}
						testID="showcase-start"
					>
						{C.cta}
					</Button>
				</View>
				<Text
					style={styles.link}
					onPress={show.login}
					accessibilityRole="link"
					testID="showcase-login"
				>
					{C.login}
				</Text>
			</ScreenScroll>
		</View>
	);
};
