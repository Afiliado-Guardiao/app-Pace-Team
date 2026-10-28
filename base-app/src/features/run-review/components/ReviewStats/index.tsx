import React from "react";
import { Text, View } from "react-native";

import { ITheme, useTheme } from "@/theme";

import { RUN_REVIEW_COPY } from "../../constants";

interface IReviewStatsProps {
	stats: {
		distance: { value: string; unit: string };
		time: { value: string; unit: string };
		pace: string;
		speed: string;
	};
}

const createReviewStatsStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;
	return {
		grid: { flexDirection: "row" as const, flexWrap: "wrap" as const, rowGap: 10 },
		cell: { width: "50%" as const },
		label: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.label,
			color: colors.textTertiary,
		},
		value: {
			marginTop: 2,
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.xl,
			color: colors.textPrimary,
		},
		unit: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
		},
	};
};

// Ficha técnica da corrida: distância, tempo, ritmo e velocidade
export const ReviewStats: React.FC<IReviewStatsProps> = ({ stats }) => {
	const { theme } = useTheme();
	const styles = createReviewStatsStyles(theme);
	const cells = [
		{ label: RUN_REVIEW_COPY.distance, value: stats.distance.value, unit: ` ${stats.distance.unit}` },
		{ label: RUN_REVIEW_COPY.time, value: stats.time.value, unit: ` ${stats.time.unit}` },
		{ label: RUN_REVIEW_COPY.pace, value: stats.pace, unit: " min/km" },
		{ label: RUN_REVIEW_COPY.speed, value: stats.speed, unit: " km/h" },
	];

	return (
		<View style={styles.grid}>
			{cells.map((c) => (
				<View key={c.label} style={styles.cell}>
					<Text style={styles.label}>{c.label}</Text>
					<Text style={styles.value}>
						{c.value}
						<Text style={styles.unit}>{c.unit}</Text>
					</Text>
				</View>
			))}
		</View>
	);
};
