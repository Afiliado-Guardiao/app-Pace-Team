import React from "react";
import { Text, View } from "react-native";

import { Chip } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { PACE_AI_COPY as C, SUGGESTIONS } from "../../constants";

interface IAiSuggestionsProps {
	onAsk: (question: string) => void;
	isDisabled: boolean;
}

const createAiSuggestionsStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { gap: spacing[2] },
		title: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			letterSpacing: 1,
			color: colors.textTertiary,
		},
		list: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: spacing[2] },
	};
};

// Perguntas prontas: um toque e o Buddy responde
export const AiSuggestions: React.FC<IAiSuggestionsProps> = ({ onAsk, isDisabled }) => {
	const { theme } = useTheme();
	const styles = createAiSuggestionsStyles(theme);

	return (
		<View style={styles.root}>
			<Text style={styles.title}>{C.suggestionsTitle.toUpperCase()}</Text>
			<View style={styles.list}>
				{SUGGESTIONS.map((question, i) => (
					<Chip
						key={question}
						size="sm"
						onPress={
							isDisabled
								? undefined
								: () => {
										onAsk(question);
									}
						}
						testID={`pace-ai-suggestion-${String(i)}`}
					>
						{question}
					</Chip>
				))}
			</View>
		</View>
	);
};
