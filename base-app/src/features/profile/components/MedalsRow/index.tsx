import React from "react";
import { View } from "react-native";

import { GlassSurface } from "@/components/pace";
import { PrizeIcon } from "@/components/shared/PrizeIcon";
import { ITheme, useTheme } from "@/theme";
import { IPrizeId } from "@/lib/prizes";

interface IMedalSlot {
	id: IPrizeId;
	isLocked: boolean;
	onPress: () => void;
}

interface IMedalsRowProps {
	medals: readonly IMedalSlot[];
}

const SIZE = 56;
const ART = 50;

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
	};
};

// Medalhas 3D: as conquistadas e, apagadas com cadeado, as que ainda faltam.
// Tocar abre o prêmio em tela cheia.
export const MedalsRow: React.FC<IMedalsRowProps> = ({ medals }) => {
	const { theme } = useTheme();
	const styles = createMedalsRowStyles(theme);

	return (
		<View style={styles.row}>
			{medals.map((m) => (
				<GlassSurface
					key={m.id}
					appearance={styles.appearance}
					radius={SIZE / 2}
					style={styles.medal}
				>
					<PrizeIcon id={m.id} size={ART} isLocked={m.isLocked} onPress={m.onPress} />
				</GlassSurface>
			))}
		</View>
	);
};
