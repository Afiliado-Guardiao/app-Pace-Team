import React from "react";
import { Text, View } from "react-native";

import { BarChart, GlassCard } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { TEAM_DETAILS_COPY, WEEK_AREA, WEEK_DAYS } from "../../constants";

interface IWeeklyCardProps {
	// Km de segunda a domingo
	days: readonly number[];
}

const createWeeklyCardStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;
	return {
		header: {
			flexDirection: "row" as const,
			justifyContent: "space-between" as const,
			alignItems: "center" as const,
			marginBottom: 16,
		},
		title: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.body,
			color: colors.textPrimary,
		},
		unit: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.label,
			color: colors.textTertiary,
		},
	};
};

// Km da equipe por dia da semana, com o melhor dia em destaque.
export const WeeklyCard: React.FC<IWeeklyCardProps> = ({ days }) => {
	const { theme } = useTheme();
	const styles = createWeeklyCardStyles(theme);
	const data = days.map((value, i) => ({ value, label: WEEK_DAYS.charAt(i) }));

	return (
		<GlassCard>
			<View style={styles.header}>
				<Text style={styles.title}>{TEAM_DETAILS_COPY.weekly}</Text>
				<Text style={styles.unit}>{TEAM_DETAILS_COPY.weeklyUnit}</Text>
			</View>
			<BarChart
				data={data}
				areaHeight={WEEK_AREA}
				radius={10}
				idleColor={theme.pace.colors.barSoft}
			/>
		</GlassCard>
	);
};
