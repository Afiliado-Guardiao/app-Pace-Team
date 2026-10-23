import React from "react";
import { View } from "react-native";

import { GlassCard, StatTile } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { formatPoints } from "@/lib/pace";

import { TEAM_COPY } from "../../constants";

const createTeamStatsStyles = (theme: ITheme) => ({
	row: { flexDirection: "row" as const, gap: theme.pace.spacing[2] },
	cell: { flex: 1, minWidth: 0 },
});

// Posição, pontos e km coletivos da equipe em três cartões.
interface ITeamStatsProps {
	position: number;
	points: number;
	km: number;
}

export const TeamStats: React.FC<ITeamStatsProps> = ({ position, points, km }) => {
	const { theme } = useTheme();
	const styles = createTeamStatsStyles(theme);
	const stats = [
		{ label: TEAM_COPY.position, value: `${String(position)}º`, icon: "trophy", accent: true },
		{ label: TEAM_COPY.points, value: formatPoints(points), icon: "zap", accent: false },
		{ label: TEAM_COPY.collectiveKm, value: String(Math.round(km)), icon: "route", accent: false },
	];

	return (
		<View style={styles.row}>
			{stats.map((s) => (
				<GlassCard key={s.label} padding={14} radius={22} style={styles.cell}>
					<StatTile size="sm" icon={s.icon} label={s.label} value={s.value} accent={s.accent} />
				</GlassCard>
			))}
		</View>
	);
};
