import React from "react";
import { View } from "react-native";

import Animated from "react-native-reanimated";

import { useTheme } from "@/theme";

import { CONFETTI_PIECES, createConfettiStyles } from "./styles";

interface IConfettiProps {
	// Altura que os papeizinhos percorrem (a tela ou o cartão)
	height: number;
}

// Confetes caindo uma vez (comemoração de recorde no percurso)
export const Confetti: React.FC<IConfettiProps> = ({ height }) => {
	const { theme } = useTheme();
	const styles = createConfettiStyles(theme, height);

	return (
		<View style={styles.box} pointerEvents="none">
			{CONFETTI_PIECES.map((p, i) => (
				<Animated.View key={i} style={styles.piece(p, i)} />
			))}
		</View>
	);
};
