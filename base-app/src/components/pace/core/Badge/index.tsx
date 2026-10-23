import React from "react";
import { Text, View } from "react-native";

import { useTheme } from "@/theme";

import { createBadgeStyles } from "./styles";
import { IBadgeProps } from "./types";

// Etiqueta pílula. Verde/âmbar/vermelho só para validação da corrida.
export const Badge: React.FC<IBadgeProps> = ({
	tone = "neutral",
	dot = false,
	children,
	style,
}) => {
	const { theme } = useTheme();
	const styles = createBadgeStyles(theme, tone);

	return (
		<View style={[styles.root, style]}>
			{dot ? <View style={styles.dot} /> : null}
			<Text style={styles.text} numberOfLines={1}>
				{children}
			</Text>
		</View>
	);
};

export * from "./types";
