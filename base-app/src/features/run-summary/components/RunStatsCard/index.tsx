import React from "react";
import { View } from "react-native";

import { GlassCard, StatTile } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { distanceParts, durationParts, formatPace, formatSpeed } from "@/lib/pace";

import { RUN_SUMMARY_COPY } from "../../constants";

interface IRunStatsCardProps {
	seconds: number;
	km: number;
}

const createRunStatsCardStyles = (theme: ITheme) => ({
	grid: {
		flexDirection: "row" as const,
		flexWrap: "wrap" as const,
		rowGap: 18,
		columnGap: theme.pace.spacing[3],
	},
	cell: { width: "47%" as const },
});

// Distância, tempo, ritmo médio e velocidade média em grade 2×2.
export const RunStatsCard: React.FC<IRunStatsCardProps> = ({ seconds, km }) => {
	const { theme } = useTheme();
	const styles = createRunStatsCardStyles(theme);
	const pace = formatPace(km > 0 ? seconds / km : 0);
	const distance = distanceParts(km);
	const time = durationParts(seconds);

	return (
		<GlassCard>
			<View style={styles.grid}>
				<StatTile
					style={styles.cell}
					icon="map-pin"
					label={RUN_SUMMARY_COPY.distance}
					value={distance.value}
					unit={distance.unit}
				/>
				<StatTile
					style={styles.cell}
					icon="timer"
					label={RUN_SUMMARY_COPY.totalTime}
					value={time.value}
					unit={time.unit}
				/>
				<StatTile
					style={styles.cell}
					icon="gauge"
					label={RUN_SUMMARY_COPY.avgPace}
					value={pace}
					unit="min/km"
				/>
				<StatTile
					style={styles.cell}
					icon="wind"
					label={RUN_SUMMARY_COPY.avgSpeed}
					value={formatSpeed(km, seconds)}
					unit="km/h"
				/>
			</View>
		</GlassCard>
	);
};
