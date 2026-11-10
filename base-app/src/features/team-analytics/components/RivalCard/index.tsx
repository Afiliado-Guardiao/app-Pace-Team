import React from "react";
import { Text, View } from "react-native";

import { GlassCard, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { formatKm } from "@/lib/pace";
import { IAnalyticsRival } from "@/lib/supabase";

import { ANALYTICS_COPY as C } from "../../constants";
import { pctWidth } from "../../utils/analyticsView";

interface IRivalCardProps {
	rival: IAnalyticsRival | null;
	teamName: string;
	// km da equipe nesta semana (número)
	teamKm: number;
}

const BAR_H = 10;

const createRivalCardStyles = (theme: ITheme) => {
	const { colors, spacing, typography, radii } = theme.pace;
	return {
		root: { gap: spacing[3] },
		head: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[2] },
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		},
		text: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			lineHeight: typography.sizes.sm * 1.4,
			color: colors.textSecondary,
		},
		strong: { fontFamily: typography.fonts.extrabold, color: colors.textPrimary },
		line: { gap: 4 },
		lineHead: { flexDirection: "row" as const, justifyContent: "space-between" as const },
		name: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			color: colors.textPrimary,
		},
		track: {
			height: BAR_H,
			borderRadius: radii.pill,
			backgroundColor: colors.barTrack,
			overflow: "hidden" as const,
		},
		us: colors.accent,
		them: colors.barSoftFill,
		icon: colors.orange[400],
	};
};

// Quanto falta (ou quanto sobra) para a equipe logo à frente no ranking
export const RivalCard: React.FC<IRivalCardProps> = ({ rival, teamName, teamKm }) => {
	const { theme } = useTheme();
	const styles = createRivalCardStyles(theme);
	if (!rival) {
		return (
			<GlassCard>
				<Text style={styles.text}>{C.rivalNone}</Text>
			</GlassCard>
		);
	}
	const isBehind = rival.gapKm > 0;
	const gap = `${formatKm(Math.abs(rival.gapKm), 1)} km`;
	const top = Math.max(1, rival.km, teamKm);
	const lines = [
		{ name: teamName, km: teamKm, color: styles.us },
		{ name: rival.name, km: rival.km, color: styles.them },
	];

	return (
		<GlassCard>
			<View style={styles.root}>
				<View style={styles.head}>
					<Icon name="swords" size={18} color={styles.icon} />
					<Text style={styles.title}>{C.rivalTitle}</Text>
				</View>
				<Text style={styles.text}>
					{isBehind ? C.rivalBehind : C.rivalAhead}
					<Text style={styles.strong}>{gap}</Text>
					{isBehind ? C.rivalBehindEnd : C.rivalAheadEnd}
					<Text style={styles.strong}>{rival.name}</Text>.
				</Text>
				{lines.map((line) => (
					<View key={line.name} style={styles.line}>
						<View style={styles.lineHead}>
							<Text style={styles.name}>{line.name}</Text>
							<Text style={styles.name}>{`${formatKm(line.km, 1)} km`}</Text>
						</View>
						<View style={styles.track}>
							<View
								style={{
									width: pctWidth(line.km / top),
									height: BAR_H,
									backgroundColor: line.color,
								}}
							/>
						</View>
					</View>
				))}
			</View>
		</GlassCard>
	);
};
