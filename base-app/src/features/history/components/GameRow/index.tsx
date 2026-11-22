import React from "react";
import { Text, View } from "react-native";

import { GlassSurface, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { IGameEntry } from "../../hooks/useHistoryGames";

interface IGameRowProps {
	entry: IGameEntry;
}

const ICON = 34;

const createGameRowStyles = (theme: ITheme, isLoss: boolean) => {
	const { blur, colors, typography, spacing } = theme.pace;
	const tone = isLoss ? colors.statusDanger : colors.statusSuccess;
	return {
		row: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: spacing[3],
			padding: spacing[3],
		},
		appearance: {
			fill: "glassFill" as const,
			blur: blur.intensity.glass,
			border: tone,
			rim: false,
		},
		icon: {
			width: ICON,
			height: ICON,
			borderRadius: ICON / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: isLoss ? colors.statusDangerSoft : colors.statusSuccessSoft,
		},
		texts: { flex: 1, gap: 2 },
		title: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		detail: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
		},
		points: { fontFamily: typography.fonts.extrabold, fontSize: typography.sizes.sm, color: tone },
		tone,
	};
};

// Pontos que a roleta da equipe deu ou tirou, no Histórico
export const GameRow: React.FC<IGameRowProps> = ({ entry }) => {
	const { theme } = useTheme();
	const styles = createGameRowStyles(theme, entry.isLoss);

	return (
		<GlassSurface appearance={styles.appearance} radius={18} style={styles.row}>
			<View style={styles.icon}>
				<Icon name="dices" size={18} color={styles.tone} />
			</View>
			<View style={styles.texts}>
				<Text style={styles.title}>{entry.title}</Text>
				<Text style={styles.detail}>{entry.detail}</Text>
			</View>
			<Text style={styles.points}>{entry.points}</Text>
		</GlassSurface>
	);
};
