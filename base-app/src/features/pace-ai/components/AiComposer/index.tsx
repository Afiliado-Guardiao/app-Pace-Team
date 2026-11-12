import React from "react";
import { Text, TextInput, View } from "react-native";

import { IconButton } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { MAX_QUESTION, PACE_AI_COPY as C } from "../../constants";

export interface IAiComposerModel {
	draft: string;
	setDraft: (text: string) => void;
	submit: () => void;
	isSending: boolean;
	left: number;
	limit: number;
	isListening: boolean;
	isSpeakOn: boolean;
	listen: () => void;
	stopListening: () => void;
	toggleSpeak: () => void;
	speedLabel: string;
	cycleSpeed: () => void;
}

interface IAiComposerProps {
	model: IAiComposerModel;
	bottom: number;
}

const BTN = 44;

const createAiComposerStyles = (theme: ITheme, bottom: number) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: {
			paddingHorizontal: 16,
			paddingTop: spacing[2],
			paddingBottom: bottom + spacing[2],
			gap: 6,
			backgroundColor: colors.glassPanel,
			borderTopWidth: 1,
			borderTopColor: colors.glassBorder,
		},
		row: { flexDirection: "row" as const, alignItems: "flex-end" as const, gap: spacing[2] },
		input: {
			flex: 1,
			minHeight: BTN,
			maxHeight: 120,
			paddingHorizontal: spacing[4],
			paddingTop: 12,
			paddingBottom: 12,
			borderRadius: BTN / 2,
			backgroundColor: colors.glass1,
			borderWidth: 1,
			borderColor: colors.glassBorder,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		},
		meta: {
			flexDirection: "row" as const,
			justifyContent: "space-between" as const,
			alignItems: "center" as const,
		},
		left: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.micro,
			color: colors.textTertiary,
		},
		voice: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[2] },
		speed: {
			minWidth: 40,
			paddingHorizontal: spacing[2],
			paddingVertical: 4,
			borderRadius: 12,
			overflow: "hidden" as const,
			textAlign: "center" as const,
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			color: colors.textPrimary,
			backgroundColor: colors.glass2,
		},
		placeholder: colors.textTertiary,
	};
};

// Campo da pergunta, microfone (voz no iPhone) e enviar
export const AiComposer: React.FC<IAiComposerProps> = ({ model, bottom }) => {
	const { theme } = useTheme();
	const styles = createAiComposerStyles(theme, bottom);
	const canSend = model.draft.trim().length > 0 && !model.isSending && model.left > 0;

	return (
		<View style={styles.root}>
			<View style={styles.row}>
				<TextInput
					style={styles.input}
					value={model.draft}
					onChangeText={model.setDraft}
					placeholder={model.isListening ? C.listening : C.placeholder}
					placeholderTextColor={styles.placeholder}
					maxLength={MAX_QUESTION}
					multiline
					editable={!model.isListening}
					accessibilityLabel={C.placeholder}
					testID="pace-ai-input"
				/>
				<IconButton
					icon={model.isListening ? "square" : "mic"}
					label={model.isListening ? C.micStop : C.mic}
					variant={model.isListening ? "accent" : "glass"}
					size={BTN}
					onPress={model.isListening ? model.stopListening : model.listen}
					disabled={model.isSending || model.left <= 0}
					testID="pace-ai-mic"
				/>
				<IconButton
					icon="send"
					label={C.send}
					variant="accent"
					size={BTN}
					onPress={model.submit}
					disabled={!canSend}
					testID="pace-ai-send"
				/>
			</View>
			<View style={styles.meta}>
				<Text style={styles.left}>{C.left(model.left, model.limit)}</Text>
				<View style={styles.voice}>
					<Text
						style={styles.speed}
						onPress={model.cycleSpeed}
						accessibilityRole="button"
						accessibilityLabel={C.speed}
						testID="pace-ai-speed"
					>
						{model.speedLabel}
					</Text>
					<IconButton
						icon={model.isSpeakOn ? "volume-2" : "volume-x"}
						label={model.isSpeakOn ? C.speakOff : C.speakOn}
						size={28}
						onPress={model.toggleSpeak}
						testID="pace-ai-speak"
					/>
				</View>
			</View>
		</View>
	);
};
