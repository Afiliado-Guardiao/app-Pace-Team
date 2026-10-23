import React from "react";
import { View } from "react-native";

import Animated from "react-native-reanimated";

import { ITheme, useTheme } from "@/theme";

import { STACK } from "../../constants";
import { IStackCardId, IStackPhase, useHomeStack } from "../../hooks/useHomeStack";
import { useStackCardStyle } from "../../hooks/useStackCardStyle";
import { TeamRunFace } from "../TeamRunFace";
import { ViradaFace } from "../ViradaFace";

interface IHomeStackProps {
	onOpen: (id: IStackCardId) => void;
}

const DOT = 6;
const DOT_ACTIVE = 18;
const DOTS_BOTTOM = -14;
const CARD_TOP = 4;
const MARGIN_X = 4;
const MARGIN_TOP = 6;

const createHomeStackStyles = (theme: ITheme) => {
	const { colors, radii, shadows, spacing } = theme.pace;
	return {
		root: { height: STACK.height + STACK.extra, marginTop: MARGIN_TOP, marginHorizontal: MARGIN_X },
		card: { position: "absolute" as const, left: 0, right: 0, top: CARD_TOP },
		frontShadow: { borderRadius: radii.hero, boxShadow: shadows.stackFront },
		backShadow: { borderRadius: radii.hero, boxShadow: shadows.stackBack },
		dim: {
			position: "absolute" as const,
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			borderRadius: radii.hero,
			backgroundColor: colors.stackDim,
		},
		dots: {
			position: "absolute" as const,
			left: 0,
			right: 0,
			bottom: DOTS_BOTTOM,
			flexDirection: "row" as const,
			justifyContent: "center" as const,
			gap: spacing[1.5],
		},
		dot: { width: DOT, height: DOT, borderRadius: DOT / 2, backgroundColor: colors.dotIdleStrong },
		dotActive: {
			width: DOT_ACTIVE,
			height: DOT,
			borderRadius: DOT / 2,
			backgroundColor: colors.ink.white,
		},
	};
};

interface IStackCardProps {
	id: IStackCardId;
	stack: ReturnType<typeof useHomeStack>;
	styles: ReturnType<typeof createHomeStackStyles>;
}

// Um card da pilha: pose inclinada, sombra e escurecimento quando está atrás.
const StackCard: React.FC<IStackCardProps> = ({ id, stack, styles }) => {
	const isFront = stack.front === id;
	const phase: IStackPhase = stack.phase;
	const pose = useStackCardStyle(
		isFront,
		phase,
		id === "virada" && stack.isFresh ? stack.shakeKey : 0,
	);

	return (
		<Animated.View
			style={[styles.card, pose]}
			{...stack.handlersFor(id)}
			testID={`home-stack-${id}`}
		>
			<View style={isFront ? styles.frontShadow : styles.backShadow}>
				{id === "run" ? <TeamRunFace /> : <ViradaFace isFresh={stack.isFresh} />}
				{isFront ? null : <View style={styles.dim} pointerEvents="none" />}
			</View>
		</Animated.View>
	);
};

const CARDS: readonly IStackCardId[] = ["run", "virada"];

// Dois cards sobrepostos e inclinados (última corrida e Modo Virada).
export const HomeStack: React.FC<IHomeStackProps> = ({ onOpen }) => {
	const { theme } = useTheme();
	const stack = useHomeStack({ onOpen });
	const styles = createHomeStackStyles(theme);

	return (
		<View style={styles.root}>
			{CARDS.map((id) => (
				<StackCard key={id} id={id} stack={stack} styles={styles} />
			))}
			<View style={styles.dots} pointerEvents="none">
				{CARDS.map((id) => (
					<View key={id} style={id === stack.front ? styles.dotActive : styles.dot} />
				))}
			</View>
		</View>
	);
};
