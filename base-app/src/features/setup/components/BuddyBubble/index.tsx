import React from "react";
import { Text, View } from "react-native";

import { ITheme, useTheme } from "@/theme";

import { useTypewriter } from "../../hooks/useTypewriter";

interface IBuddyBubbleProps {
	text: string;
	// Rabinho embaixo (padrão) ou à esquerda
	tail?: "bottom" | "left";
}

const TAIL = 10;

const createBuddyBubbleStyles = (theme: ITheme, tail: "bottom" | "left") => {
	const { colors, typography } = theme.pace;
	return {
		root: {
			alignSelf: tail === "left" ? ("flex-start" as const) : ("center" as const),
			maxWidth: 260,
		},
		pill: {
			paddingHorizontal: 14,
			paddingVertical: 9,
			borderRadius: 16,
			backgroundColor: colors.glassLight,
			boxShadow: "0 8px 20px rgba(0,0,0,.30)",
		},
		text: {
			fontFamily: typography.fonts.bold,
			fontSize: 13,
			lineHeight: 18,
			color: colors.textOnLight,
		},
		hidden: { color: "transparent" },
		cursor: { color: colors.orange[500] },
		tail: {
			position: "absolute" as const,
			width: TAIL,
			height: TAIL,
			backgroundColor: colors.glassLight,
			transform: [{ rotate: "45deg" }],
			...(tail === "bottom"
				? { bottom: -TAIL / 2, left: "50%" as const, marginLeft: -TAIL / 2 }
				: { left: -TAIL / 2, top: 14 }),
		},
	};
};

// Balão de fala do Buddy, que "digita" o texto com o cursor laranja
export const BuddyBubble: React.FC<IBuddyBubbleProps> = ({ text, tail = "bottom" }) => {
	const { theme } = useTheme();
	const styles = createBuddyBubbleStyles(theme, tail);
	const typed = useTypewriter(text);

	return (
		<View style={styles.root}>
			<View style={styles.tail} />
			<View style={styles.pill}>
				<Text style={styles.text}>
					{typed.shown}
					{typed.isTyping ? <Text style={styles.cursor}>|</Text> : null}
					<Text style={styles.hidden}>{typed.rest}</Text>
				</Text>
			</View>
		</View>
	);
};
