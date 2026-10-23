import React from "react";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/theme";

import { createLayoutTextStyles } from "../styles";

interface ISectionHeaderProps {
	title: string;
	action?: string;
	onAction?: () => void;
}

// Título de seção com ação laranja à direita ("Ver tudo", "Histórico"…).
export const SectionHeader: React.FC<ISectionHeaderProps> = ({ title, action, onAction }) => {
	const { theme } = useTheme();
	const styles = createLayoutTextStyles(theme);

	return (
		<View style={styles.sectionHeader}>
			<Text style={styles.sectionTitle} accessibilityRole="header">
				{title}
			</Text>
			{action ? (
				<Pressable
					testID={`section-action-${title}`}
					accessibilityRole="button"
					accessibilityLabel={action}
					onPress={onAction}
					hitSlop={8}
				>
					<Text style={styles.sectionAction}>{action}</Text>
				</Pressable>
			) : null}
		</View>
	);
};
