import React from "react";
import { Pressable, Text, View } from "react-native";

import { CountUp, GlassSurface, Icon } from "@/components/pace";
import { useTheme } from "@/theme";

import { createInnerTileStyles } from "./styles";

interface IInnerTileProps {
	icon: string;
	lineA: string;
	lineB: string;
	value: string;
	unit?: string;
	onPress?: () => void;
}

const ICON_SIZE = 16;
const COUNT_DELAY = 250;

// Bloco interno do card "Sua semana" (segunda camada de vidro, mais clara).
export const InnerTile: React.FC<IInnerTileProps> = ({
	icon,
	lineA,
	lineB,
	value,
	unit,
	onPress,
}) => {
	const { theme } = useTheme();
	const styles = createInnerTileStyles(theme);

	return (
		<Pressable
			style={styles.pressable}
			disabled={!onPress}
			onPress={onPress}
			accessibilityLabel={`${lineA} ${lineB}`}
		>
			<GlassSurface appearance={styles.appearance} radius={theme.pace.radii.lg} style={styles.tile}>
				<View style={styles.header}>
					<View style={styles.iconDot}>
						<Icon name={icon} size={ICON_SIZE} color={theme.pace.colors.orange[400]} />
					</View>
					<Text style={styles.label}>
						{lineA}
						{"\n"}
						{lineB}
					</Text>
				</View>
				<Text style={styles.value}>
					<CountUp value={value} delay={COUNT_DELAY} />
					{unit ? <Text style={styles.unit}> {unit}</Text> : null}
				</Text>
			</GlassSurface>
		</Pressable>
	);
};
