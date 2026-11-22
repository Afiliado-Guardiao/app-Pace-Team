import React from "react";
import { Pressable, Text, View } from "react-native";

import Animated, { FadeInUp } from "react-native-reanimated";

import { ITheme, useTheme } from "@/theme";

import { BuddyHero } from "./components/BuddyHero";
import { ShowcaseNotes } from "./components/ShowcaseNotes";
import { CTA, LOGIN, REF, SHOWCASE_COPY as C, WORDS } from "./constants";
import { useShowcase } from "./hooks/useShowcase";

interface IShowcaseLayout {
	u: number;
	left: number;
	top: number;
	isLeaving: boolean;
}

const createShowcaseStyles = (theme: ITheme, { u, left, top, isLeaving }: IShowcaseLayout) => {
	const { colors, typography, radii } = theme.pace;
	const leaving = {
		opacity: isLeaving ? 0 : 1,
		transitionProperty: "opacity" as const,
		transitionDuration: "0.25s",
	};
	const word = {
		fontFamily: typography.fonts.bold,
		fontSize: WORDS.size * u,
		lineHeight: WORDS.line * u,
		color: colors.textTertiary,
	};
	return {
		root: { flex: 1, backgroundColor: colors.bgSunken },
		// A arte de cima, de ponta a ponta da tela
		art: { position: "absolute" as const, left: 0, top: 0, ...leaving },
		// O quadro da referência (591 × 1280) para o Bud, a frase e os botões
		stage: { position: "absolute" as const, top, left, width: REF.w * u, height: REF.h * u },
		// No Começar, tudo some e fica só o Bud decolando
		fade: {
			position: "absolute" as const,
			left: 0,
			top: 0,
			width: REF.w * u,
			height: REF.h * u,
			...leaving,
		},
		words: {
			position: "absolute" as const,
			left: 0,
			right: 0,
			top: WORDS.y * u,
			alignItems: "center" as const,
		},
		word,
		cta: {
			position: "absolute" as const,
			left: CTA.x * u,
			top: CTA.y * u,
			width: CTA.w * u,
			height: CTA.h * u,
			borderRadius: radii.pill,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: colors.textPrimary,
		},
		ctaText: {
			fontFamily: typography.fonts.bold,
			fontSize: CTA.font * u,
			color: colors.textOnLight,
		},
		login: {
			position: "absolute" as const,
			left: 0,
			right: 0,
			top: LOGIN.y * u,
			textAlign: "center" as const,
			fontFamily: typography.fonts.semibold,
			fontSize: LOGIN.font * u,
			color: colors.textPrimary,
		},
	};
};

// 01 · boas-vindas do onboarding (preto), igual à referência: a roleta da
// equipe, o relógio, o Bud bebendo água e o Bud com febre com frases e setas
// à mão, o Bud piscando, "Cada corrida. Cada km. Juntos." e o Começar
export const ShowcaseScreen: React.FC = () => {
	const { theme } = useTheme();
	const show = useShowcase();
	const styles = createShowcaseStyles(theme, show);

	return (
		<View style={styles.root}>
			<Animated.View style={styles.art} pointerEvents="none">
				<ShowcaseNotes u={show.ua} />
			</Animated.View>
			<View style={styles.stage}>
				<BuddyHero pose={show.pose} u={show.u} flight={show.flight} heroRef={show.heroRef} />
				<Animated.View style={styles.fade} pointerEvents="box-none">
					<Animated.View entering={FadeInUp.delay(1000).duration(600)} style={styles.words}>
						<Text style={styles.word}>{C.lineA}</Text>
						<Text style={styles.word}>{C.lineB}</Text>
						<Text style={styles.word}>{C.lineC}</Text>
					</Animated.View>
					<Animated.View entering={FadeInUp.delay(1300).duration(600)} style={styles.cta}>
						<Pressable
							style={({ pressed }) => [
								styles.cta,
								{ left: 0, top: 0 },
								pressed && { opacity: 0.85 },
							]}
							onPress={show.start}
							accessibilityRole="button"
							accessibilityLabel={C.cta}
							testID="showcase-start"
						>
							<Text style={styles.ctaText}>{C.cta}</Text>
						</Pressable>
					</Animated.View>
					<Animated.Text
						entering={FadeInUp.delay(1300).duration(600)}
						style={styles.login}
						onPress={show.login}
						accessibilityRole="link"
						testID="showcase-login"
					>
						{C.login}
					</Animated.Text>
				</Animated.View>
			</View>
		</View>
	);
};
