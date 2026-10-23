import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";

import { useTheme } from "@/theme";

import { createLayoutTextStyles } from "../styles";

interface ILabelProps {
	children: React.ReactNode;
	style?: StyleProp<TextStyle>;
}

// .pt-label: micro-rótulo em caixa alta (PONTOS PROVISÓRIOS, HOJE…).
export const Label: React.FC<ILabelProps> = ({ children, style }) => {
	const { theme } = useTheme();
	const styles = createLayoutTextStyles(theme);

	return <Text style={[styles.label, style]}>{children}</Text>;
};
