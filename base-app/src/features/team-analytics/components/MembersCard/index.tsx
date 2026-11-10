import React from "react";
import { Text, View } from "react-native";

import { Badge, GlassCard } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { formatKm } from "@/lib/pace";

import { ANALYTICS_COPY as C } from "../../constants";
import { IAnalyticsMemberRow, pctWidth } from "../../utils/analyticsView";

interface IMembersCardProps {
	rows: readonly IAnalyticsMemberRow[];
}

const BAR_H = 6;
const DAYS = [0, 1, 2, 3, 4, 5, 6] as const;
const DAY_DOT = 7;

const createMembersCardStyles = (theme: ITheme) => {
	const { colors, spacing, typography, radii } = theme.pace;
	return {
		root: { gap: spacing[4] },
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
		row: { gap: 6 },
		head: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[2] },
		name: {
			flex: 1,
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		km: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		track: {
			height: BAR_H,
			borderRadius: radii.pill,
			backgroundColor: colors.barTrack,
			overflow: "hidden" as const,
		},
		fill: { height: BAR_H, backgroundColor: colors.accent },
		days: { flexDirection: "row" as const, alignItems: "center" as const, gap: 4 },
		day: { width: DAY_DOT, height: DAY_DOT, borderRadius: DAY_DOT / 2 },
		dayOn: colors.statusSuccess,
		dayOff: colors.barSoft,
		daysText: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.micro,
			color: colors.textTertiary,
		},
	};
};

// Cada integrante: km da semana, dias com corrida e os selos de destaque
export const MembersCard: React.FC<IMembersCardProps> = ({ rows }) => {
	const { theme } = useTheme();
	const styles = createMembersCardStyles(theme);

	return (
		<GlassCard>
			<View style={styles.root}>
				<View>
					<Text style={styles.title}>{C.membersTitle}</Text>
					<Text style={styles.sub}>{C.membersSub}</Text>
				</View>
				{rows.map((m) => (
					<View key={m.id} style={styles.row}>
						<View style={styles.head}>
							<Text style={styles.name} numberOfLines={1}>
								{m.isYou ? `${m.name}${C.you}` : m.name}
							</Text>
							{m.isConsistent ? <Badge tone="success">{C.consistent}</Badge> : null}
							{m.needsHelp ? <Badge tone="danger">{C.needsHelp}</Badge> : null}
							<Text style={styles.km}>{`${formatKm(m.weekKm, 1)} km`}</Text>
						</View>
						<View style={styles.track}>
							<View style={[styles.fill, { width: pctWidth(m.ratio) }]} />
						</View>
						<View style={styles.days}>
							{DAYS.map((d) => (
								<View
									key={d}
									style={[
										styles.day,
										{ backgroundColor: d < m.weekDays ? styles.dayOn : styles.dayOff },
									]}
								/>
							))}
							<Text style={styles.daysText}>{`${String(m.weekDays)}${C.daysWeek}`}</Text>
						</View>
					</View>
				))}
			</View>
		</GlassCard>
	);
};
