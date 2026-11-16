import React from "react";
import { Pressable, Text, View } from "react-native";

import { ITheme, useTheme } from "@/theme";
import { ITeamGameLevel } from "@/lib/supabase";

import { GAME_LEVELS } from "../../constants";

const createLevelPickerStyles = (theme: ITheme) => {
	const { colors, typography, spacing, radii } = theme.pace;
	return {
		row: { flexDirection: "row" as const, gap: spacing[2] },
		card: {
			flex: 1,
			padding: spacing[3],
			borderRadius: radii.md,
			borderWidth: 1,
			borderColor: colors.glassBorder,
			backgroundColor: colors.glass1,
			gap: 4,
		},
		selected: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
		label: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		desc: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
		},
		win: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			color: colors.statusSuccess,
		},
		lose: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			color: colors.statusDanger,
		},
	};
};

interface ILevelPickerProps {
	level: ITeamGameLevel;
	onChange: (level: ITeamGameLevel) => void;
}

// Fácil ganha e perde pouco; difícil ganha e perde o dobro
export const LevelPicker: React.FC<ILevelPickerProps> = ({ level, onChange }) => {
	const { theme } = useTheme();
	const styles = createLevelPickerStyles(theme);

	return (
		<View style={styles.row}>
			{GAME_LEVELS.map((item) => (
				<Pressable
					key={item.level}
					testID={`team-game-level-${item.level}`}
					accessibilityRole="radio"
					accessibilityState={{ selected: item.level === level }}
					accessibilityLabel={`Nível ${item.label}`}
					onPress={() => {
						onChange(item.level);
					}}
					style={[styles.card, item.level === level ? styles.selected : null]}
				>
					<Text style={styles.label}>{item.label}</Text>
					<Text style={styles.desc}>{item.desc}</Text>
					<Text style={styles.win}>{`+${String(item.win)} pts`}</Text>
					<Text style={styles.lose}>{`−${String(item.lose)} pts`}</Text>
				</Pressable>
			))}
		</View>
	);
};
