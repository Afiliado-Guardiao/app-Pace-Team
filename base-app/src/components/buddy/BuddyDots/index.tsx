import React from "react";
import { TextStyle, View, ViewStyle } from "react-native";

import Animated from "react-native-reanimated";

import { ITheme, useTheme } from "@/theme";
import { IBuddyAccessoryId, IBuddyColorId } from "@/lib/buddy/constants";

import { anim, EASE_OUT, EASE_SPRING } from "../animations";
import { BUDDY_H, BUDDY_W, BuddyFigure, IBuddyPose } from "../BuddyFigure";

export type IBuddyDotsMode = "bud" | "dots";

interface IBuddyDotsProps {
	// "dots": o Bud se amassa e vira as três bolinhas do carregamento
	mode: IBuddyDotsMode;
	pose: IBuddyPose;
	// Tamanho do Bud (1 = 140 × 135)
	scale?: number;
	color?: IBuddyColorId;
	accessories?: readonly IBuddyAccessoryId[];
	// Texto embaixo das bolinhas (ex.: "Pensando…")
	label?: string;
}

const NONE: readonly IBuddyAccessoryId[] = [];
const DOT = 11;
const GAP = 17;
// Altura do meio do corpo no quadro do Bud (onde as bolinhas nascem)
const BODY_MID = 70;
const CREAM = "#F2EADF";

const dotStyle = (i: number, isDots: boolean, s: number): ViewStyle =>
	({
		position: "absolute",
		left: (BUDDY_W * s) / 2 - (DOT * s) / 2,
		top: BODY_MID * s - (DOT * s) / 2,
		width: DOT * s,
		height: DOT * s,
		opacity: isDots ? 1 : 0,
		transform: [{ translateX: isDots ? (i - 1) * GAP * s : 0 }, { scale: isDots ? 1 : 0.3 }],
		transitionProperty: ["opacity", "transform"],
		transitionDuration: isDots ? "0.36s" : "0.2s",
		transitionDelay: isDots ? `${String(0.12 + i * 0.05)}s` : "0s",
		transitionTimingFunction: EASE_SPRING,
	}) as ViewStyle;

const createBuddyDotsStyles = (theme: ITheme, s: number, isDots: boolean) => ({
	root: { width: BUDDY_W * s, height: BUDDY_H * s } as ViewStyle,
	// O corpo amassa para baixo e some enquanto as bolinhas aparecem
	bud: {
		position: "absolute",
		left: 0,
		top: 0,
		width: BUDDY_W,
		height: BUDDY_H,
		transformOrigin: "0% 0%",
		transform: [{ scale: s }],
	} as ViewStyle,
	squash: {
		width: BUDDY_W,
		height: BUDDY_H,
		transformOrigin: "50% 60%",
		opacity: isDots ? 0 : 1,
		transform: [{ scaleX: isDots ? 0.5 : 1 }, { scaleY: isDots ? 0.12 : 1 }],
		transitionProperty: ["opacity", "transform"],
		transitionDuration: isDots ? "0.26s" : "0.45s",
		transitionTimingFunction: isDots ? EASE_OUT : EASE_SPRING,
	} as ViewStyle,
	ball: {
		width: "100%",
		height: "100%",
		borderRadius: (DOT * s) / 2,
		backgroundColor: CREAM,
		boxShadow: "0 2px 4px rgba(0,0,0,.35)",
	} as ViewStyle,
	label: {
		position: "absolute",
		left: -40,
		right: -40,
		top: BODY_MID * s + DOT * s + 8,
		textAlign: "center",
		fontFamily: theme.pace.typography.fonts.semibold,
		fontSize: 13,
		color: theme.pace.colors.accent,
		opacity: isDots ? 1 : 0,
		transitionProperty: "opacity",
		transitionDuration: "0.25s",
	} as TextStyle,
});

// O Bud que vira o carregamento: amassa, se divide em três bolinhas que pulam
// e, quando termina, volta a ser o Bud (com uma molinha)
export const BuddyDots: React.FC<IBuddyDotsProps> = ({
	mode,
	pose,
	scale = 1,
	color = "branco",
	accessories = NONE,
	label,
}) => {
	const { theme } = useTheme();
	const isDots = mode === "dots";
	const styles = createBuddyDotsStyles(theme, scale, isDots);

	return (
		<View style={styles.root} pointerEvents="none" testID="buddy-dots">
			<View style={styles.bud}>
				<Animated.View style={styles.squash}>
					<BuddyFigure pose={pose} color={color} accessories={accessories} />
				</Animated.View>
			</View>
			{[0, 1, 2].map((i) => (
				<Animated.View key={i} style={dotStyle(i, isDots, scale)}>
					<Animated.View
						style={[
							styles.ball,
							isDots ? anim("dotBounce", "0.9s", { delay: `${String(i * 0.14)}s` }) : null,
						]}
					/>
				</Animated.View>
			))}
			{label ? <Animated.Text style={styles.label}>{label}</Animated.Text> : null}
		</View>
	);
};
