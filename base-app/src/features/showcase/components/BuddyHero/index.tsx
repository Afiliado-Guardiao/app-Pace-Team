import React from "react";
import { Text, View, ViewStyle } from "react-native";

import Animated, { ZoomIn } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { BUDDY_H, BUDDY_W, BuddyFigure, EASE_OUT, IBuddyPose } from "@/components/buddy";
import { ITheme, useTheme } from "@/theme";

import { SHOWCASE_COPY as C } from "../../constants";
import { IShowcaseFlight } from "../../hooks/useShowcase";

interface IBuddyHeroProps {
	pose: IBuddyPose;
	k: number;
	flight: IShowcaseFlight;
	heroRef: React.RefObject<View | null>;
}

const SIZE = 190;
const ARROW = { w: 62, h: 46 } as const;
// Setinha desenhada à mão apontando para o Buddy (como na referência)
const ARROW_PATH = "M58 40 C 56 18, 38 6, 8 12 M8 12 L 18 4 M8 12 L 17 20";
// Foguete: decola acelerando (lento no começo, rápido no fim)
const LAUNCH = "cubic-bezier(0.55, 0, 0.85, 0.35)";

// Susto: pula e estica; foguete: afina, encolhe e voa até o canto de cima
const flightStyle = (f: IShowcaseFlight): ViewStyle => {
	if (f.stage === "rocket") {
		return {
			transform: [{ translateX: f.dx }, { translateY: f.dy }, { scaleX: 0.22 }, { scaleY: 0.34 }],
			transitionProperty: "transform",
			transitionDuration: "0.7s",
			transitionTimingFunction: LAUNCH,
		} as ViewStyle;
	}
	const isScared = f.stage === "scared";
	return {
		transform: [
			{ translateX: 0 },
			{ translateY: isScared ? -10 : 0 },
			{ scaleX: isScared ? 0.92 : 1 },
			{ scaleY: isScared ? 1.1 : 1 },
		],
		transitionProperty: "transform",
		transitionDuration: "0.22s",
		transitionTimingFunction: EASE_OUT,
	} as ViewStyle;
};

const createBuddyHeroStyles = (theme: ITheme, k: number, f: IShowcaseFlight) => {
	const { colors, typography } = theme.pace;
	const scale = (SIZE * k) / BUDDY_W;
	const box = { width: BUDDY_W * scale, height: BUDDY_H * scale };
	return {
		root: { alignSelf: "center" as const, ...box },
		flight: { position: "absolute" as const, ...box },
		measure: { position: "absolute" as const, left: 0, top: 0, ...box },
		inner: { position: "absolute" as const, transform: [{ scale }], transformOrigin: "0% 0%" },
		// Chama do foguete embaixo do Bud
		flame: {
			position: "absolute" as const,
			left: box.width / 2 - 14 * k,
			top: box.height * 0.72,
			width: 28 * k,
			height: 46 * k,
			borderRadius: 14 * k,
			backgroundColor: colors.orange[400],
			boxShadow: `0 0 18px 6px ${colors.accentRing}`,
			opacity: f.stage === "rocket" ? 1 : 0,
			transitionProperty: "opacity",
			transitionDuration: "0.12s",
		} as ViewStyle,
		note: {
			position: "absolute" as const,
			right: -84 * k,
			top: box.height * 0.42,
			alignItems: "flex-start" as const,
			opacity: f.stage === "idle" ? 1 : 0,
			transitionProperty: "opacity",
			transitionDuration: "0.2s",
		} as ViewStyle,
		name: {
			marginTop: 2,
			marginLeft: 18,
			fontFamily: typography.handFonts.regular,
			fontSize: 24,
			color: colors.textPrimary,
		},
		ink: colors.textPrimary,
	};
};

// O Bud grande no meio: pisca quando a página abre; no Começar ele se assusta,
// vira foguete e sobe até onde vai conversar na próxima página
export const BuddyHero: React.FC<IBuddyHeroProps> = ({ pose, k, flight, heroRef }) => {
	const { theme } = useTheme();
	const styles = createBuddyHeroStyles(theme, k, flight);

	return (
		<Animated.View entering={ZoomIn.delay(700).springify().damping(12)} style={styles.root}>
			{/* Caixa comum (não animada) só para medir onde o Bud está: no iPhone o
			    Animated.View não tem measureInWindow e o app travava no Começar */}
			<View ref={heroRef} collapsable={false} style={styles.measure} pointerEvents="none" />
			<Animated.View style={[styles.flight, flightStyle(flight)]} pointerEvents="none">
				<Animated.View style={styles.flame} />
				<View style={styles.inner}>
					<BuddyFigure pose={pose} color="branco" accessories={[]} />
				</View>
			</Animated.View>
			<Animated.View style={styles.note} pointerEvents="none">
				<Svg width={ARROW.w} height={ARROW.h} viewBox={`0 0 ${String(ARROW.w)} ${String(ARROW.h)}`}>
					<Path
						d={ARROW_PATH}
						stroke={styles.ink}
						strokeWidth={1.8}
						fill="none"
						strokeLinecap="round"
					/>
				</Svg>
				<Text style={styles.name}>{C.name}</Text>
			</Animated.View>
		</Animated.View>
	);
};
