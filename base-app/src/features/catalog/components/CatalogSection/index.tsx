import React from "react";
import { Text, View } from "react-native";

import { useTheme } from "@/theme";

import { createCatalogSectionStyles } from "../../styles";

interface ICatalogSectionProps {
	title: string;
	caption?: string;
	children: React.ReactNode;
}

// Bloco do catálogo: título, legenda opcional e as amostras empilhadas.
export const CatalogSection: React.FC<ICatalogSectionProps> = ({ title, caption, children }) => {
	const { theme } = useTheme();
	const styles = createCatalogSectionStyles(theme);

	return (
		<View style={styles.section}>
			<Text style={styles.title} accessibilityRole="header">
				{title}
			</Text>
			{caption ? <Text style={styles.caption}>{caption}</Text> : null}
			{children}
		</View>
	);
};
