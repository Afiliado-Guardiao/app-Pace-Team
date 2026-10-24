import React from "react";
import { View } from "react-native";

import { GlassSurface, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

interface IMedalSlot {
	key: string;
	icon: string;
	color: "rankGold" | "orange400" | "orange300" | "rankSilver" | "textDisabled";
}

interface IMedalsRowProps {
	medals: readonly IMedalSlot[];
}

const SIZE = 56;

const createMedalsRowStyles = (theme: ITheme) => {
	const { colors } = theme.pace;
	return {
		row: { flexDirection: "row" as const, gap: 10 },
		medal: {
			width: SIZE,
			height: SIZE,
			alignItems: "center" as const,
			justifyContent: "center" as const,
		},
		appearance: { fill: { color: colors.glass2 }, border: colors.glassBorder, rim: true },
		colors: {
			rankGold: colors.rankGold,
			orange400: colors.orange[400],
			orange300: colors.orange[300],
			rankSilver: colors.rankSilver,
			textDisabled: colors.textDisabled,
		},
	};
};

// Medalhas conquistadas e, com cadeado, as que ainda faltam.
export const MedalsRow: React.FC<IMedalsRowProps> = ({ medals }) => {
	const { theme } = useTheme();
	const styles = createMedalsRowStyles(theme);

	return (
		<View style={styles.row}>
			{medals.map((m) => (
				<GlassSurface
					key={m.key}
					appearance={styles.appearance}
					radius={SIZE / 2}
					style={styles.medal}
				>
					<Icon name={m.icon} size={22} color={styles.colors[m.color]} />
				</GlassSurface>
			))}
		</View>
	);
};
