import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { ITheme, useTheme } from "@/theme";

import { PACE_AI_COPY as C } from "../../constants";

const createAiThinkingStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: {
			alignSelf: "flex-start" as const,
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: spacing[2],
			paddingHorizontal: spacing[4],
			paddingVertical: spacing[3],
			borderRadius: 20,
			borderBottomLeftRadius: 6,
			backgroundColor: colors.glassPanel,
			borderWidth: 1,
			borderColor: colors.glassBorder,
		},
		text: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
		},
		spinner: colors.orange[400],
	};
};

// Enquanto a resposta não chega
export const AiThinking: React.FC = () => {
	const { theme } = useTheme();
	const styles = createAiThinkingStyles(theme);

	return (
		<View style={styles.root}>
			<ActivityIndicator size="small" color={styles.spinner} />
			<Text style={styles.text}>{C.thinking}</Text>
		</View>
	);
};
