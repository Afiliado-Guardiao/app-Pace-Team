import React from "react";
import { Pressable, Text, View } from "react-native";

import { GlassCard, Icon } from "@/components/pace";

import { SETUP_COPY as C } from "../../constants";
import { ICallMode, phrasesOf } from "../../hooks/useStepCall";

import { IStepCallStyles } from "./styles";

interface ICallDetailsProps {
	mode: ICallMode;
	onSay: (index: number) => void;
	styles: IStepCallStyles;
}

// Frases para tocar e "ouvir" a resposta do Bud (Siri e água)
const Phrases: React.FC<ICallDetailsProps & { hint: string; note?: string }> = ({
	mode,
	onSay,
	styles,
	hint,
	note,
}) => (
	<View style={styles.phrases}>
		<Text style={styles.hint}>{hint}</Text>
		{phrasesOf(mode).map((p, i) => (
			<Pressable
				key={p.say}
				onPress={() => {
					onSay(i);
				}}
				accessibilityRole="button"
				accessibilityLabel={p.say}
				testID={`setup-${mode}-${String(i)}`}
			>
				<GlassCard>
					<View style={styles.phrase}>
						<Icon name="audio-lines" size={18} color={styles.accent} />
						<Text style={styles.phraseText}>{`“${p.say}”`}</Text>
					</View>
				</GlassCard>
			</Pressable>
		))}
		{note ? <Text style={styles.hint}>{note}</Text> : null}
	</View>
);

// Texto de cada aba do 3b
export const CallDetails: React.FC<ICallDetailsProps> = (props) => {
	const { mode, styles } = props;
	if (mode === "siri") return <Phrases {...props} hint={C.callSiriText} />;
	if (mode === "water") return <Phrases {...props} hint={C.callWaterText} note={C.callWaterNote} />;
	if (mode === "watch") {
		return (
			<View>
				<Text style={styles.text}>{C.callWatchText}</Text>
				<Text style={styles.text}>{C.callWatchBrands}</Text>
				<Text style={styles.hint}>{C.callWatchHint}</Text>
			</View>
		);
	}
	return (
		<View>
			<Text style={styles.text}>{C.callTapText}</Text>
			<Text style={styles.hint}>{C.callTapHint}</Text>
		</View>
	);
};
