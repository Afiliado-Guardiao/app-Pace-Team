import React from "react";
import { Text, View } from "react-native";

import Animated, { ZoomIn } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { BUDDY_H, BUDDY_W, BuddyFigure, IBuddyPose } from "@/components/buddy";
import { ITheme, useTheme } from "@/theme";

import { SHOWCASE_COPY as C } from "../../constants";

interface IBuddyHeroProps {
	pose: IBuddyPose;
	k: number;
}

const SIZE = 190;
const ARROW = { w: 62, h: 46 } as const;
// Setinha desenhada à mão apontando para o Buddy (como na referência)
const ARROW_PATH = "M58 40 C 56 18, 38 6, 8 12 M8 12 L 18 4 M8 12 L 17 20";

const createBuddyHeroStyles = (theme: ITheme, k: number) => {
	const { colors, typography } = theme.pace;
	const scale = (SIZE * k) / BUDDY_W;
	return {
		root: { alignSelf: "center" as const, width: BUDDY_W * scale, height: BUDDY_H * scale },
		inner: { position: "absolute" as const, transform: [{ scale }], transformOrigin: "0% 0%" },
		note: {
			position: "absolute" as const,
			right: -78 * k,
			top: BUDDY_H * scale * 0.42,
			alignItems: "flex-start" as const,
		},
		name: {
			marginTop: 2,
			marginLeft: 22,
			fontFamily: typography.brandFonts.semibold,
			fontStyle: "italic" as const,
			fontSize: 22,
			color: colors.textPrimary,
			transform: [{ rotate: "-6deg" }],
		},
		ink: colors.textPrimary,
	};
};

// O Buddy grande no meio, acenando e piscando, com "Bud" escrito à mão
export const BuddyHero: React.FC<IBuddyHeroProps> = ({ pose, k }) => {
	const { theme } = useTheme();
	const styles = createBuddyHeroStyles(theme, k);

	return (
		<Animated.View entering={ZoomIn.delay(700).springify().damping(12)} style={styles.root}>
			<View style={styles.inner} pointerEvents="none">
				<BuddyFigure pose={pose} color="branco" accessories={[]} />
			</View>
			<View style={styles.note} pointerEvents="none">
				<Svg width={ARROW.w} height={ARROW.h} viewBox={`0 0 ${String(ARROW.w)} ${String(ARROW.h)}`}>
					<Path
						d={ARROW_PATH}
						stroke={styles.ink}
						strokeWidth={2}
						fill="none"
						strokeLinecap="round"
					/>
				</Svg>
				<Text style={styles.name}>{C.name}</Text>
			</View>
		</Animated.View>
	);
};
