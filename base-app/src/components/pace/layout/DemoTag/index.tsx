import React from "react";
import { Text, View } from "react-native";

import { useTheme } from "@/theme";

import { Icon } from "../../core/Icon";
import { createLayoutTextStyles } from "../styles";

const ICON_SIZE = 11;

// Aviso "Dados de exemplo" onde o protótipo ainda usa números fictícios.
export const DemoTag: React.FC<{ label?: string }> = ({ label = "Dados de exemplo" }) => {
	const { theme } = useTheme();
	const styles = createLayoutTextStyles(theme);

	return (
		<View style={styles.demoTag}>
			<Icon name="flask-conical" size={ICON_SIZE} color={theme.pace.colors.textTertiary} />
			<Text style={styles.demoText}>{label}</Text>
		</View>
	);
};
