import React from "react";
import { Pressable, Text, View } from "react-native";

import { Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { PACE_AI_COPY as C } from "../../constants";

interface IAiBubbleProps {
	role: "user" | "assistant";
	content: string;
	// Só nos balões do Buddy: "Ouvir" lê a resposta de novo
	isPlaying?: boolean;
	onListen?: () => void;
	testID?: string;
}

const createAiBubbleStyles = (theme: ITheme, isMine: boolean, isPlaying: boolean) => {
	const { colors, spacing, typography, radii } = theme.pace;
	return {
		root: {
			alignSelf: isMine ? ("flex-end" as const) : ("flex-start" as const),
			maxWidth: "88%" as const,
			paddingHorizontal: spacing[4],
			paddingVertical: spacing[3],
			gap: spacing[2],
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
		listen: {
			alignSelf: "flex-start" as const,
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: spacing[1.5],
			paddingVertical: spacing[1],
			paddingHorizontal: spacing[2.5],
			borderRadius: radii.pill,
			borderWidth: 1,
			borderColor: isPlaying ? colors.accent : colors.glassBorder,
			backgroundColor: isPlaying ? colors.accentSoft : colors.glass1,
		},
		listenText: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: isPlaying ? colors.textAccent : colors.textSecondary,
		},
		icon: isPlaying ? colors.textAccent : colors.textSecondary,
	};
};

// Um balão da conversa: o atleta em laranja à direita, o Buddy em vidro à
// esquerda (com "Ouvir" para escutar a resposta de novo)
export const AiBubble: React.FC<IAiBubbleProps> = ({
	role,
	content,
	isPlaying = false,
	onListen,
	testID,
}) => {
	const { theme } = useTheme();
	const styles = createAiBubbleStyles(theme, role === "user", isPlaying);

	return (
		<View style={styles.root} testID={testID}>
			<Text style={styles.text} selectable>
				{content}
			</Text>
			{onListen ? (
				<Pressable
					onPress={onListen}
					style={styles.listen}
					hitSlop={8}
					accessibilityRole="button"
					accessibilityLabel={isPlaying ? C.listenStop : C.listenAgainLabel}
					testID={testID ? `${testID}-listen` : "pace-ai-listen"}
				>
					<Icon name={isPlaying ? "square" : "volume-2"} size={13} color={styles.icon} />
					<Text style={styles.listenText}>{isPlaying ? C.listenStop : C.listenAgain}</Text>
				</Pressable>
			) : null}
		</View>
	);
};
