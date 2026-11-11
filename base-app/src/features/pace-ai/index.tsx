import React from "react";
import { ScrollView, Text, View } from "react-native";

import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FloatingToast, ScreenBackground, TopBar } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { AiBubble } from "./components/AiBubble";
import { AiComposer } from "./components/AiComposer";
import { AiHello } from "./components/AiHello";
import { AiHistorySheet } from "./components/AiHistorySheet";
import { AiSuggestions } from "./components/AiSuggestions";
import { AiThinking } from "./components/AiThinking";
import { AiWeekCard } from "./components/AiWeekCard";
import { PACE_AI_COPY as C } from "./constants";
import { usePaceAiScreen } from "./hooks/usePaceAiScreen";

const GUTTER = 22;

const createPaceAiStyles = (theme: ITheme, top: number) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { flex: 1 },
		flex: { flex: 1 },
		top: { paddingTop: top + spacing[2], paddingHorizontal: GUTTER },
		content: { padding: GUTTER, gap: spacing.stackGap },
		disclaimer: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
			textAlign: "center" as const,
		},
	};
};

// PACE AI: o Buddy responde sobre as corridas do atleta (Team Pro)
export const PaceAiScreen: React.FC = () => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const screen = usePaceAiScreen();
	const styles = createPaceAiStyles(theme, insets.top);
	const isEmpty = screen.messages.length === 0;

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.teamRunningSunset} />
			<KeyboardAvoidingView behavior="padding" style={styles.flex}>
				<View style={styles.top}>
					<TopBar
						title={C.title}
						onBack={screen.goBack}
						right={{ icon: "messages-square", label: C.history, onPress: screen.openHistory }}
					/>
				</View>
				<ScrollView
					ref={screen.scrollRef}
					style={styles.flex}
					contentContainerStyle={styles.content}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<AiHello text={screen.greeting} isThinking={screen.isSending} />
					{isEmpty && screen.week ? <AiWeekCard week={screen.week} /> : null}
					{isEmpty ? <AiSuggestions onAsk={screen.ask} isDisabled={screen.isSending} /> : null}
					{screen.messages.map((m) => (
						<AiBubble key={m.id} role={m.role} content={m.content} />
					))}
					{screen.isSending ? <AiThinking /> : null}
					{isEmpty ? <Text style={styles.disclaimer}>{C.disclaimer}</Text> : null}
				</ScrollView>
				<AiComposer model={screen.composer} bottom={insets.bottom} />
			</KeyboardAvoidingView>
			<AiHistorySheet model={screen.history} />
			<FloatingToast toast={screen.toast} />
		</View>
	);
};
