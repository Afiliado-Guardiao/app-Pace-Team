import React from "react";
import { Text, View } from "react-native";

import { GlassCard } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { formatKm } from "@/lib/pace";

import { ANALYTICS_COPY as C } from "../../constants";
import { IAnalyticsView } from "../../utils/analyticsView";

interface IWeeksChartProps {
	view: IAnalyticsView;
}

const CHART_H = 120;
const BAR_W = 22;
const MIN_BAR = 4;

const createWeeksChartStyles = (theme: ITheme) => {
	const { colors, spacing, typography, radii } = theme.pace;
	const small = {
		fontFamily: typography.fonts.semibold,
		fontSize: typography.sizes.micro,
		color: colors.textTertiary,
	};
	return {
		root: { gap: spacing[3] },
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		},
		sub: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		chart: {
			height: CHART_H + 34,
			flexDirection: "row" as const,
			alignItems: "flex-end" as const,
			justifyContent: "space-between" as const,
		},
		col: { alignItems: "center" as const, gap: 4 },
		value: { ...small, color: colors.textSecondary },
		bar: { width: BAR_W, borderRadius: radii.sm },
		label: small,
		barIdle: colors.barIdle,
		barNow: colors.accent,
		period: {
			flexDirection: "row" as const,
			justifyContent: "space-between" as const,
			paddingTop: spacing[3],
			borderTopWidth: 1,
			borderTopColor: colors.hairline,
		},
		periodLabel: small,
		periodValue: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		},
		good: colors.statusSuccess,
		bad: colors.statusDanger,
	};
};

// Barras de km das últimas 8 semanas (a atual em laranja) e o comparativo mensal
export const WeeksChart: React.FC<IWeeksChartProps> = ({ view }) => {
	const { theme } = useTheme();
	const styles = createWeeksChartStyles(theme);
	const delta = view.period.deltaPct;
	const deltaText = delta === null ? "" : `${delta >= 0 ? "+" : ""}${String(delta)}%`;
	const deltaColor = (delta ?? 0) >= 0 ? styles.good : styles.bad;

	return (
		<GlassCard>
			<View style={styles.root}>
				<View>
					<Text style={styles.title}>{C.weeksTitle}</Text>
					<Text style={styles.sub}>{C.weeksSub}</Text>
				</View>
				<View style={styles.chart}>
					{view.bars.map((bar) => (
						<View key={bar.label} style={styles.col}>
							<Text style={styles.value}>{formatKm(bar.km, 0)}</Text>
							<View
								style={[
									styles.bar,
									{
										height: Math.max(MIN_BAR, bar.ratio * CHART_H),
										backgroundColor: bar.isCurrent ? styles.barNow : styles.barIdle,
									},
								]}
							/>
							<Text style={styles.label}>{bar.label}</Text>
						</View>
					))}
				</View>
				<View style={styles.period}>
					<View>
						<Text style={styles.periodLabel}>{C.periodTitle}</Text>
						<Text style={styles.periodValue}>{`${view.period.km} km`}</Text>
					</View>
					<View>
						<Text style={styles.periodLabel}>{C.periodPrev}</Text>
						<Text style={styles.periodValue}>
							{`${view.period.prevKm} km `}
							<Text style={{ color: deltaColor }}>{deltaText}</Text>
						</Text>
					</View>
				</View>
			</View>
		</GlassCard>
	);
};
