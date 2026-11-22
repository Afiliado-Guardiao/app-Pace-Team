import React from "react";
import { Image, ImageStyle, Text, View, ViewStyle } from "react-native";

import Animated, { cubicBezier, ZoomIn } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { BUDDY_H, BUDDY_W, BuddyFigure, EASE_OUT, IBuddyPose } from "@/components/buddy";
import { ITheme, useTheme } from "@/theme";

import budArcs from "../../../../../assets/onboarding/bud-arcs.png";
import { HERO, SHOWCASE_COPY as C } from "../../constants";
import { IShowcaseFlight } from "../../hooks/useShowcase";

interface IBuddyHeroProps {
	pose: IBuddyPose;
	u: number;
	flight: IShowcaseFlight;
	heroRef: React.RefObject<View | null>;
}

// Setinha à mão apontando para o Buddy e o "buddy" embaixo (medidas da
// referência, a partir do canto do Bud)
const ARROW = { x: 275, y: 93, w: 95, h: 60 } as const;
const ARROW_PATH = "M82 50 C 82 26, 58 8, 10 12 M10 12 L 22 3 M10 12 L 21 22";
const NAME = { x: 27, y: 61, size: 32 } as const;
// As duas ondinhas em cima da cabeça (recortadas da arte do dono do app)
const ARCS = { x: 87, y: -32, w: 60, h: 28 } as const;
// Foguete: decola acelerando (lento no começo, rápido no fim). No iPhone a
// curva tem que vir do cubicBezier do Reanimated: escrita como texto
// funciona na prévia web, mas no aparelho dá erro e o app cai ao tocar em Começar
const LAUNCH = cubicBezier(0.55, 0, 0.85, 0.35);

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

const createBuddyHeroStyles = (theme: ITheme, u: number, f: IShowcaseFlight) => {
	const { colors, typography } = theme.pace;
	const k = u * 1.5;
	const scale = (HERO.w * u) / BUDDY_W;
	const box = { width: BUDDY_W * scale, height: BUDDY_H * scale };
	return {
		root: { position: "absolute" as const, left: HERO.x * u, top: HERO.y * u, ...box },
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
			left: ARROW.x * u,
			top: ARROW.y * u,
			opacity: f.stage === "idle" ? 1 : 0,
			transitionProperty: "opacity",
			transitionDuration: "0.2s",
		} as ViewStyle,
		arcs: {
			position: "absolute",
			left: ARCS.x * u,
			top: ARCS.y * u,
			width: ARCS.w * u,
			height: ARCS.h * u,
			opacity: f.stage === "idle" ? 1 : 0,
			transitionProperty: "opacity",
			transitionDuration: "0.2s",
		} as ImageStyle,
		name: {
			position: "absolute" as const,
			left: NAME.x * u,
			top: NAME.y * u,
			fontFamily: typography.handFonts.regular,
			fontSize: NAME.size * u,
			color: colors.textPrimary,
		},
		ink: colors.textPrimary,
	};
};

// O Bud grande no meio: pisca quando a página abre; no Começar ele se assusta,
// vira foguete e sobe até onde vai conversar na próxima página
export const BuddyHero: React.FC<IBuddyHeroProps> = ({ pose, u, flight, heroRef }) => {
	const { theme } = useTheme();
	const styles = createBuddyHeroStyles(theme, u, flight);

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
			<Image source={budArcs} style={styles.arcs} />
			<Animated.View style={styles.note} pointerEvents="none">
				<Svg
					width={ARROW.w * u}
					height={ARROW.h * u}
					viewBox={`0 0 ${String(ARROW.w)} ${String(ARROW.h)}`}
				>
					<Path
						d={ARROW_PATH}
						stroke={styles.ink}
						strokeWidth={2.6}
						fill="none"
						strokeLinecap="round"
					/>
				</Svg>
				<Text style={styles.name}>{C.name}</Text>
			</Animated.View>
		</Animated.View>
	);
};
