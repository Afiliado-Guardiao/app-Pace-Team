import React from "react";
import { Text, View } from "react-native";

import { GlassCard } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { ANALYTICS_COPY as C } from "../../constants";
import { IAnalyticsView } from "../../utils/analyticsView";

interface IRankCardProps {
	view: IAnalyticsView;
}

const DOT = 34;

const createRankCardStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
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
		row: { flexDirection: "row" as const, justifyContent: "space-between" as const },
		col: { alignItems: "center" as const, gap: 4 },
		dot: {
			width: DOT,
			height: DOT,
			borderRadius: DOT / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			borderWidth: 1,
		},
		pos: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		label: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.micro,
			color: colors.textTertiary,
		},
		idle: { backgroundColor: colors.glass1, borderColor: colors.glassBorder },
		now: { backgroundColor: colors.accent, borderColor: colors.accentBorderTab },
	};
};

// A posição da equipe na cidade em cada uma das 8 semanas
export const RankCard: React.FC<IRankCardProps> = ({ view }) => {
	const { theme } = useTheme();
	const styles = createRankCardStyles(theme);
	const last = view.ranks.length - 1;

	return (
		<GlassCard>
			<View style={styles.root}>
				<View>
					<Text style={styles.title}>{C.rankTitle}</Text>
					<Text style={styles.sub}>{C.rankSub}</Text>
				</View>
				<View style={styles.row}>
					{view.ranks.map((rank, i) => (
						<View key={rank.label} style={styles.col}>
							<View style={[styles.dot, i === last ? styles.now : styles.idle]}>
								<Text style={styles.pos}>
									{rank.position ? `${String(rank.position)}º` : C.rankNone}
								</Text>
							</View>
							<Text style={styles.label}>{rank.label}</Text>
						</View>
					))}
				</View>
			</View>
		</GlassCard>
	);
};
