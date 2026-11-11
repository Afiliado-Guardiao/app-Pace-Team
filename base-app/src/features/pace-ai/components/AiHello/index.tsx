import React from "react";
import { Text, View } from "react-native";

import { BUDDY_H, BUDDY_W, BuddyFigure, IBuddyPose } from "@/components/buddy";
import { ITheme, useTheme } from "@/theme";
import { useBuddyLook } from "@/lib/buddy";

interface IAiHelloProps {
	text: string;
	isThinking: boolean;
}

const SCALE = 0.72;
const WAVE: IBuddyPose = { act: "wave", phase: null, blink: false, gx: 0, gy: 0 };
const THINK: IBuddyPose = { act: "curious", phase: null, blink: false, gx: 2, gy: -2 };
const TAIL = 10;

const createAiHelloStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[2] },
		buddy: { width: BUDDY_W * SCALE, height: BUDDY_H * SCALE },
		buddyInner: {
			position: "absolute" as const,
			transform: [{ scale: SCALE }],
			transformOrigin: "0% 0%",
		},
		bubble: {
			flex: 1,
			paddingHorizontal: 14,
			paddingVertical: 10,
			borderRadius: 16,
			backgroundColor: colors.glassLight,
			boxShadow: "0 8px 20px rgba(0,0,0,.30)",
		},
		tail: {
			position: "absolute" as const,
			left: -TAIL / 2,
			top: 18,
			width: TAIL,
			height: TAIL,
			backgroundColor: colors.glassLight,
			transform: [{ rotate: "45deg" }],
		},
		text: {
			fontFamily: typography.fonts.bold,
			fontSize: 14,
			lineHeight: 19,
			color: colors.textOnLight,
		},
	};
};

// O Buddy do atleta (com a cor e os acessórios dele) falando no topo da PACE AI
export const AiHello: React.FC<IAiHelloProps> = ({ text, isThinking }) => {
	const { theme } = useTheme();
	const styles = createAiHelloStyles(theme);
	const look = useBuddyLook();

	return (
		<View style={styles.root}>
			<View style={styles.buddy} pointerEvents="none">
				<View style={styles.buddyInner}>
					<BuddyFigure
						pose={isThinking ? THINK : WAVE}
						color={look.color}
						accessories={look.accessories}
						effect={look.effect}
					/>
				</View>
			</View>
			<View style={styles.bubble}>
				<View style={styles.tail} />
				<Text style={styles.text}>{text}</Text>
			</View>
		</View>
	);
};
