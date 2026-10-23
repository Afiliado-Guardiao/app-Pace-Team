import React from "react";
import { StyleProp, Text, ViewStyle } from "react-native";

import { useTheme } from "@/theme";

import { GlassSurface } from "../../primitives";

import { createGlassPillStyles } from "./styles";

interface IGlassPillProps {
	children: React.ReactNode;
	style?: StyleProp<ViewStyle>;
}

// Pílula de vidro para status sobre mapa/foto (ex.: "GPS pronto · ±4 m").
export const GlassPill: React.FC<IGlassPillProps> = ({ children, style }) => {
	const { theme } = useTheme();
	const styles = createGlassPillStyles(theme);
	const content = React.Children.map(children, (child) =>
		typeof child === "string" ? <Text style={styles.text}>{child}</Text> : child,
	);

	return (
		<GlassSurface
			appearance={styles.appearance}
			radius={theme.pace.radii.pill}
			style={[styles.pill, style]}
		>
			{content}
		</GlassSurface>
	);
};
