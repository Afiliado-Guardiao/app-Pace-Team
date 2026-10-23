import React from "react";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/theme";

import { Icon } from "../../core/Icon";
import { GlassSurface } from "../../primitives";

import { createListRowStyles } from "./styles";

interface IListRowProps {
	title: string;
	sub?: string;
	icon?: string;
	iconTone?: "accent" | "default";
	right?: React.ReactNode;
	onPress?: () => void;
	testID?: string;
}

const ICON_SIZE = 18;

// Linha de lista em vidro: ícone em círculo, título, subtítulo e ação à direita.
export const ListRow: React.FC<IListRowProps> = ({
	title,
	sub,
	icon,
	iconTone = "default",
	right,
	onPress,
	testID,
}) => {
	const { theme } = useTheme();
	const styles = createListRowStyles(theme, iconTone === "accent");

	return (
		<Pressable testID={testID} disabled={!onPress} onPress={onPress} accessibilityLabel={title}>
			<GlassSurface
				appearance={styles.appearance}
				radius={theme.pace.radii.rowSm}
				style={styles.row}
			>
				{icon ? (
					<View style={styles.iconDot}>
						<Icon name={icon} size={ICON_SIZE} color={styles.iconColor} />
					</View>
				) : null}
				<View style={styles.texts}>
					<Text style={styles.title}>{title}</Text>
					{sub ? <Text style={styles.sub}>{sub}</Text> : null}
				</View>
				{right}
			</GlassSurface>
		</Pressable>
	);
};
