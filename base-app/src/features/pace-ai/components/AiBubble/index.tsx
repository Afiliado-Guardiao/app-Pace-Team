import React from "react";
import { Text, View } from "react-native";

import { ITheme, useTheme } from "@/theme";

interface IAiBubbleProps {
	role: "user" | "assistant";
	content: string;
}

const createAiBubbleStyles = (theme: ITheme, isMine: boolean) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: {
			alignSelf: isMine ? ("flex-end" as const) : ("flex-start" as const),
			maxWidth: "88%" as const,
			paddingHorizontal: spacing[4],
			paddingVertical: spacing[3],
			borderRadius: 20,
			borderBottomRightRadius: isMine ? 6 : 20,
			borderBottomLeftRadius: isMine ? 20 : 6,
			backgroundColor: isMine ? colors.accent : colors.glassPanel,
			borderWidth: isMine ? 0 : 1,
			borderColor: colors.glassBorder,
		},
		text: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			lineHeight: typography.sizes.ui * 1.42,
			color: isMine ? colors.onAccent : colors.textPrimary,
		},
	};
};

// Um balão da conversa: o atleta em laranja à direita, o Buddy em vidro à esquerda
export const AiBubble: React.FC<IAiBubbleProps> = ({ role, content }) => {
	const { theme } = useTheme();
	const styles = createAiBubbleStyles(theme, role === "user");

	return (
		<View style={styles.root}>
			<Text style={styles.text} selectable>
				{content}
			</Text>
		</View>
	);
};
