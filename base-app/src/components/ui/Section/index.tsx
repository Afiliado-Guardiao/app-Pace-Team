import React from "react";
import { Text, View } from "react-native";

import { useTheme } from "@/theme";

import { createSectionStyles } from "./styles";
import { ISectionProps } from "./types";

export const Section: React.FC<ISectionProps> = ({ title, children, style }) => {
	const { theme } = useTheme();
	const styles = createSectionStyles(theme);

	return (
		<View style={[styles.container, style]}>
			<Text style={styles.title}>{title}</Text>
			{children}
		</View>
	);
};

export * from "./types";
