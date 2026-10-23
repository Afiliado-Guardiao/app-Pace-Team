import React from "react";
import { Text, View } from "react-native";

import { BarChart, GlassCard, SegmentedControl } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { PERIOD_LABELS, PERIODS, PROFILE_COPY } from "../../constants";

interface IStatsCardProps {
	period: keyof typeof PERIOD_LABELS;
	// Km por dia da semana ou por semana do mês
	values: readonly number[];
	onChange: (period: string) => void;
}

const AREA = 80;
const MIN_BAR = 4;

const createStatsCardStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;
	return {
		header: {
			flexDirection: "row" as const,
			justifyContent: "space-between" as const,
			alignItems: "center" as const,
			gap: 10,
			marginBottom: 16,
		},
		title: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.body,
			color: colors.textPrimary,
		},
		segment: { width: 160 },
	};
};

// Km por dia (semana) ou por semana (mês), com o maior valor em destaque.
export const StatsCard: React.FC<IStatsCardProps> = ({ period, values, onChange }) => {
	const { theme } = useTheme();
	const styles = createStatsCardStyles(theme);
	const labels = PERIOD_LABELS[period];
	const data = values.map((value, i) => ({ value, label: labels[i] ?? "" }));

	return (
		<GlassCard>
			<View style={styles.header}>
				<Text style={styles.title}>{PROFILE_COPY.stats}</Text>
				<SegmentedControl
					size="sm"
					options={PERIODS}
					value={period}
					onChange={onChange}
					style={styles.segment}
					testID="profile-period"
				/>
			</View>
			<BarChart key={period} data={data} areaHeight={AREA} minHeight={MIN_BAR} radius={8} />
		</GlassCard>
	);
};
