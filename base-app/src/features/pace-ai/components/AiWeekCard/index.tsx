import React from "react";
import { Text, View } from "react-native";

import { GlassCard } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { formatKm } from "@/lib/pace";

import { PACE_AI_COPY as C } from "../../constants";
import { IAiWeekView } from "../../utils/aiWeek";

interface IAiWeekCardProps {
	week: IAiWeekView;
}

const CHART_H = 56;
const MIN_BAR = 3;

const createAiWeekCardStyles = (theme: ITheme) => {
	const { colors, spacing, typography, radii } = theme.pace;
	const label = {
		fontFamily: typography.fonts.semibold,
		fontSize: typography.sizes.micro,
		color: colors.textTertiary,
	};
	return {
		root: { gap: spacing[3] },
		head: {
			flexDirection: "row" as const,
			justifyContent: "space-between" as const,
			alignItems: "center" as const,
		},
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		},
		prev: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
		},
		stats: { flexDirection: "row" as const, gap: spacing[4] },
		stat: { gap: 2 },
		value: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 22,
			color: colors.textPrimary,
		},
		label,
		empty: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
		},
		chart: {
			height: CHART_H,
			flexDirection: "row" as const,
			alignItems: "flex-end" as const,
			gap: 6,
		},
		bar: { flex: 1, borderRadius: radii.xs },
		chartLabel: label,
		barIdle: colors.barIdle,
		barNow: colors.accent,
	};
};

// Resumo da semana do atleta: km, corridas, ritmo e as últimas 8 semanas
export const AiWeekCard: React.FC<IAiWeekCardProps> = ({ week }) => {
	const { theme } = useTheme();
	const styles = createAiWeekCardStyles(theme);
	const prevText = week.prevKm === null ? "" : C.prevWeek(formatKm(week.prevKm, 1));

	return (
		<GlassCard>
			<View style={styles.root}>
				<View style={styles.head}>
					<Text style={styles.title}>{C.weekTitle}</Text>
					<Text style={styles.prev}>{prevText}</Text>
				</View>
				{week.runs > 0 ? (
					<View style={styles.stats}>
						<View style={styles.stat}>
							<Text style={styles.value}>{formatKm(week.km, 1)}</Text>
							<Text style={styles.label}>{C.weekKm}</Text>
						</View>
						<View style={styles.stat}>
							<Text style={styles.value}>{String(week.runs)}</Text>
							<Text style={styles.label}>{C.weekRuns}</Text>
						</View>
						<View style={styles.stat}>
							<Text style={styles.value}>{week.pace ?? "–"}</Text>
							<Text style={styles.label}>{C.weekPace}</Text>
						</View>
					</View>
				) : (
					<Text style={styles.empty}>{C.noRuns}</Text>
				)}
				<View style={styles.chart}>
					{week.bars.map((bar) => (
						<View
							key={bar.label}
							style={[
								styles.bar,
								{
									height: Math.max(MIN_BAR, bar.ratio * CHART_H),
									backgroundColor: bar.isCurrent ? styles.barNow : styles.barIdle,
								},
							]}
						/>
					))}
				</View>
				<Text style={styles.chartLabel}>{C.weeksLabel}</Text>
			</View>
		</GlassCard>
	);
};
