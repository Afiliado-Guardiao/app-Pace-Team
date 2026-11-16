import React from "react";
import { Text, View } from "react-native";

import { ITheme, useTheme } from "@/theme";

import { formatPace } from "../../constants";

export type IGameBannerTone = "default" | "success" | "danger";

const createGameBannerStyles = (theme: ITheme, tone: IGameBannerTone) => {
	const { colors, typography, spacing, radii } = theme.pace;
	const border: Record<IGameBannerTone, string> = {
		default: colors.glassBorder,
		success: colors.statusSuccess,
		danger: colors.statusDanger,
	};
	return {
		card: {
			padding: spacing[4],
			borderRadius: radii.lg,
			borderWidth: 1,
			borderColor: border[tone],
			backgroundColor: colors.glass1,
			gap: spacing[1.5],
		},
		lead: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
		},
		name: { fontFamily: typography.fonts.extrabold, color: colors.textPrimary },
		nums: { flexDirection: "row" as const, alignItems: "flex-end" as const, gap: spacing[4] },
		km: {
			fontFamily: typography.numericFonts.extrabold,
			fontSize: typography.sizes.jumbo,
			color: colors.textPrimary,
		},
		pace: {
			fontFamily: typography.numericFonts.extrabold,
			fontSize: typography.sizes.h2,
			color: colors.accent,
			paddingBottom: 4,
		},
		unit: { fontSize: typography.sizes.sm, color: colors.textTertiary },
		note: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
		},
	};
};

interface IGameBannerProps {
	lead: string;
	// Nome em destaque depois do texto ("Caiu: Lucas")
	name?: string;
	task?: { km: number; pace: number };
	note?: string;
	tone?: IGameBannerTone;
}

// Cartão da roleta: o que caiu, o seu desafio ou o resultado final
export const GameBanner: React.FC<IGameBannerProps> = ({
	lead,
	name,
	task,
	note,
	tone = "default",
}) => {
	const { theme } = useTheme();
	const styles = createGameBannerStyles(theme, tone);

	return (
		<View style={styles.card} testID="team-game-banner">
			<Text style={styles.lead}>
				{lead}
				{name ? <Text style={styles.name}>{` ${name}`}</Text> : null}
			</Text>
			{task ? (
				<View style={styles.nums}>
					<Text style={styles.km}>
						{String(task.km)}
						<Text style={styles.unit}> km</Text>
					</Text>
					<Text style={styles.pace}>
						{formatPace(task.pace)}
						<Text style={styles.unit}> /km</Text>
					</Text>
				</View>
			) : null}
			{note ? <Text style={styles.note}>{note}</Text> : null}
		</View>
	);
};
