import React from "react";
import { Image, Text, View } from "react-native";

import { ITheme, useTheme } from "@/theme";

import { HAND_NOTES, NOTE_FONT, REF, TOP_ART, TOP_ART_H } from "../../constants";

interface IShowcaseNotesProps {
	u: number;
}

const createShowcaseNotesStyles = (theme: ITheme, u: number) => ({
	art: { width: REF.w * u, height: TOP_ART_H * u },
	note: {
		position: "absolute" as const,
		fontFamily: theme.pace.typography.handFonts.light,
		fontSize: NOTE_FONT.size * u,
		lineHeight: NOTE_FONT.line * u,
		textAlign: "center" as const,
		color: theme.pace.colors.textPrimary,
	},
});

// Parte de cima da boas-vindas: a arte do dono do app (roleta da equipe,
// relógio, Bud bebendo água, Bud com febre e as setas), parada, com as
// frases escritas à mão por cima
export const ShowcaseNotes: React.FC<IShowcaseNotesProps> = ({ u }) => {
	const { theme } = useTheme();
	const styles = createShowcaseNotesStyles(theme, u);

	return (
		<View>
			<Image source={TOP_ART} style={styles.art} />
			{HAND_NOTES.map((n) => (
				<Text key={n.text} style={[styles.note, { left: n.x * u, top: n.y * u, width: n.w * u }]}>
					{n.text}
				</Text>
			))}
		</View>
	);
};
