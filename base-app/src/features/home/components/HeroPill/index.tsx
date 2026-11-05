import React from "react";
import { Pressable, Text, View } from "react-native";

import { GlassSurface, Icon } from "@/components/pace";
import { useTheme } from "@/theme";

import { createHeroPillStyles } from "./styles";

interface IHeroPillProps {
	text: string;
	// Ícone Lucide (selo do clima) ou bolinha colorida (selo de online)
	icon?: { name: string; color: string };
	dotColor?: string;
	accessibilityLabel: string;
	onPress?: () => void;
	onLongPress?: () => void;
	testID: string;
}

const ICON_SIZE = 14;

// Pílula de vidro do bloco "Sua semana" (clima e quem está online)
export const HeroPill: React.FC<IHeroPillProps> = ({
	text,
	icon,
	dotColor,
	accessibilityLabel,
	onPress,
	onLongPress,
	testID,
}) => {
	const { theme } = useTheme();
	const styles = createHeroPillStyles(theme, dotColor);

	return (
		<Pressable
			testID={testID}
			accessibilityRole={onPress ? "button" : "text"}
			accessibilityLabel={accessibilityLabel}
			disabled={!onPress && !onLongPress}
			onPress={onPress}
			onLongPress={onLongPress}
		>
			<GlassSurface
				appearance={styles.appearance}
				radius={theme.pace.radii.pill}
				style={styles.pill}
			>
				{icon ? <Icon name={icon.name} size={ICON_SIZE} color={icon.color} /> : null}
				{dotColor ? <View style={styles.dot} /> : null}
				{text ? <Text style={styles.text}>{text}</Text> : null}
			</GlassSurface>
		</Pressable>
	);
};
