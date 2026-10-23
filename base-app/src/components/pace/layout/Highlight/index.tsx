import React from "react";
import { Text } from "react-native";

import { useTheme } from "@/theme";

import { createLayoutTextStyles } from "../styles";

interface IHighlightProps {
	children: string;
}

// Motivo "Monte sua / [equipe]": palavra-chave numa caixa laranja.
// Fica dentro de um <Text> de título e herda fonte e tamanho dele.
export const Highlight: React.FC<IHighlightProps> = ({ children }) => {
	const { theme } = useTheme();
	const styles = createLayoutTextStyles(theme);

	// Espaços inseparáveis: a caixa quebra de linha inteira, sem sobrar um
	// pedaço laranja vazio no fim da linha de cima
	return <Text style={styles.highlight}>{`\u00A0${children}\u00A0`}</Text>;
};
