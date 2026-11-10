import React from "react";
import { Text, View } from "react-native";

import { GlassCard, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { ANALYTICS_COPY as C } from "../../constants";
import { IAnalyticsView } from "../../utils/analyticsView";

interface IAnalyticsHeroProps {
	view: IAnalyticsView;
	teamName: string;
}

const BIG = 52;

const createAnalyticsHeroStyles = (theme: ITheme) => {
	const { colors, spacing, typography, radii } = theme.pace;
	const chip = {
		flexDirection: "row" as const,
		alignItems: "center" as const,
		gap: 4,
		paddingHorizontal: spacing[3],
		paddingVertical: 6,
		borderRadius: radii.pill,
		backgroundColor: colors.glass1,
	};
	return {
		root: { gap: spacing[2] },
		label: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			letterSpacing: 1.4,
			color: colors.textTertiary,
		},
		team: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.lg,
			color: colors.textPrimary,
		},
		row: { flexDirection: "row" as const, alignItems: "baseline" as const, gap: spacing[2] },
		big: { fontFamily: typography.fonts.extrabold, fontSize: BIG, color: colors.textPrimary },
		unit: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.lg,
			color: colors.textSecondary,
		},
		chips: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: spacing[2] },
		chip,
		chipText: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			color: colors.textPrimary,
		},
		good: colors.statusSuccess,
		bad: colors.statusDanger,
		accent: colors.orange[400],
	};
};

// Resumo da semana: km da equipe, variação, quem correu e posição na cidade
export const AnalyticsHero: React.FC<IAnalyticsHeroProps> = ({ view, teamName }) => {
	const { theme } = useTheme();
	const styles = createAnalyticsHeroStyles(theme);
	const isUp = (view.deltaPct ?? 0) >= 0;
	const deltaText =
		view.deltaPct === null ? null : `${isUp ? "+" : ""}${String(view.deltaPct)}%${C.vsLast}`;
	const climbText = view.climbed > 0 ? ` ↑${String(view.climbed)}` : "";
	const positionText = view.position ? `${String(view.position)}${C.position}${climbText}` : null;

	return (
		<GlassCard>
			<View style={styles.root}>
				<Text style={styles.label}>{C.weekLabel}</Text>
				<Text style={styles.team}>{teamName}</Text>
				<View style={styles.row}>
					<Text style={styles.big}>{view.weekKm}</Text>
					<Text style={styles.unit}>{C.km}</Text>
				</View>
				<View style={styles.chips}>
					{deltaText ? (
						<View style={styles.chip}>
							<Icon
								name={isUp ? "trending-up" : "trending-down"}
								size={14}
								color={isUp ? styles.good : styles.bad}
							/>
							<Text style={styles.chipText}>{deltaText}</Text>
						</View>
					) : null}
					<View style={styles.chip}>
						<Icon name="users" size={14} color={styles.accent} />
						<Text style={styles.chipText}>
							{`${String(view.runners)}${C.of}${String(view.members)}${C.ran}`}
						</Text>
					</View>
					{positionText ? (
						<View style={styles.chip}>
							<Icon name="trophy" size={14} color={styles.accent} />
							<Text style={styles.chipText}>{positionText}</Text>
						</View>
					) : null}
				</View>
			</View>
		</GlassCard>
	);
};
