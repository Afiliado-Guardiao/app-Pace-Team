import React from "react";
import { View } from "react-native";

import Animated from "react-native-reanimated";

import { IBuddyAccessoryId, IBuddyColorId } from "@/lib/buddy/constants";

import { anim } from "../animations";
import { BuddyFigure, IBuddyPose } from "../BuddyFigure";

import { createBuddyDotsStyles, DOT_COUNT, dotStyle, THINK_DELAY, THINK_STEP } from "./styles";

export type IBuddyDotsMode = "bud" | "dots";

interface IBuddyDotsProps {
	// "dots": o Bud se desmancha e vira as bolinhas do carregamento
	mode: IBuddyDotsMode;
	pose: IBuddyPose;
	// Tamanho do Bud (1 = 140 × 135)
	scale?: number;
	color?: IBuddyColorId;
	accessories?: readonly IBuddyAccessoryId[];
	// Só para o leitor de tela (ex.: "Carregando…"); nada escrito na tela
	label?: string;
}

const NONE: readonly IBuddyAccessoryId[] = [];
const DOTS = Array.from({ length: DOT_COUNT }, (_, i) => i);

const thinkStyle = (i: number) =>
	anim("dotThink", "1.1s", { delay: `${(THINK_DELAY + i * THINK_STEP).toFixed(2)}s` });

// O Bud que vira o carregamento: derrete numa gotinha, a gotinha se divide em
// quatro bolinhas que ficam "pensando" (uma onda passando por elas) e, quando
// termina, as bolinhas se juntam de novo e o Bud brota delas
export const BuddyDots: React.FC<IBuddyDotsProps> = ({
	mode,
	pose,
	scale = 1,
	color = "branco",
	accessories = NONE,
	label,
}) => {
	const isDots = mode === "dots";
	const styles = createBuddyDotsStyles(scale, isDots);

	return (
		<View
			style={styles.root}
			pointerEvents="none"
			testID="buddy-dots"
			accessibilityLabel={isDots ? label : undefined}
		>
			<View style={styles.bud}>
				<Animated.View style={styles.melt}>
					<BuddyFigure pose={pose} color={color} accessories={accessories} />
				</Animated.View>
			</View>
			{DOTS.map((i) => (
				<Animated.View key={i} style={dotStyle(i, isDots, scale)}>
					<Animated.View style={[styles.ball, isDots ? thinkStyle(i) : null]} />
				</Animated.View>
			))}
		</View>
	);
};
