import React from "react";
import { TextStyle, View, ViewStyle } from "react-native";

import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { ITheme, useTheme } from "@/theme";
import { HINTS, IHintId } from "@/lib/hints";

export type IHintSide = "left" | "top" | "topLeft";

interface IHintTipProps {
	id: IHintId;
	isShown: boolean;
	// De que lado do botão a dica aparece (a seta aponta para o botão)
	side: IHintSide;
}

const W = 168;
const ARROW = { w: 46, h: 40 } as const;
// Setinhas à mão: para a direita, para baixo e para baixo-direita
const ARROWS: Record<IHintSide, string> = {
	left: "M4 14 C 16 4, 32 6, 42 20 M42 20 L 33 18 M42 20 L 41 11",
	top: "M18 4 C 10 16, 14 28, 24 36 M24 36 L 15 34 M24 36 L 24 27",
	topLeft: "M6 6 C 20 6, 34 16, 40 34 M40 34 L 32 29 M40 34 L 42 25",
};

const POSITIONS: Record<IHintSide, ViewStyle> = {
	left: { right: "100%", top: "50%", marginTop: -30, flexDirection: "row", alignItems: "center" },
	top: { bottom: "100%", left: "50%", marginLeft: -W / 2, alignItems: "center" },
	topLeft: { bottom: "100%", right: "45%", alignItems: "flex-end" },
};

const createHintTipStyles = (theme: ITheme, side: IHintSide) => {
	const { colors, typography } = theme.pace;
	return {
		root: { position: "absolute", width: W, zIndex: 40, ...POSITIONS[side] } as ViewStyle,
		text: {
			flexShrink: 1,
			fontFamily: typography.handFonts.light,
			fontSize: 17,
			lineHeight: 22,
			color: colors.textPrimary,
			textAlign: side === "top" ? "center" : "right",
			textShadowColor: "rgba(0,0,0,.85)",
			textShadowRadius: 6,
		} as TextStyle,
		ink: colors.textPrimary,
	};
};

// Dica escrita à mão ao lado de um botão, com uma setinha apontando para ele.
// Não pega o toque: o atleta toca no botão de verdade e a dica some.
export const HintTip: React.FC<IHintTipProps> = ({ id, isShown, side }) => {
	const { theme } = useTheme();
	if (!isShown) return null;
	const styles = createHintTipStyles(theme, side);

	return (
		<Animated.View
			entering={FadeIn.duration(450)}
			exiting={FadeOut.duration(250)}
			style={styles.root}
			pointerEvents="none"
			testID={`hint-${id}`}
		>
			<Animated.Text style={styles.text}>{HINTS[id].text}</Animated.Text>
			<View>
				<Svg width={ARROW.w} height={ARROW.h} viewBox={`0 0 ${String(ARROW.w)} ${String(ARROW.h)}`}>
					<Path
						d={ARROWS[side]}
						stroke={styles.ink}
						strokeWidth={1.7}
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</Svg>
			</View>
		</Animated.View>
	);
};
