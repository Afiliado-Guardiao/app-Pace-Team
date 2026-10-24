import React from "react";
import { Text, View } from "react-native";

import { GlassCard } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { IViradaView } from "@/lib/data";
import { formatPoints } from "@/lib/pace";

import { VIRADA_COPY } from "../../constants";

const BADGE = 28;
const BADGE_RADIUS = 9;
const ROW_PADDING = 12;

const createHeadToHeadStyles = (theme: ITheme) => {
	const { borders, colors, spacing, typography } = theme.pace;
	const { fonts, sizes } = typography;
	return {
		row: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: spacing[3],
			padding: ROW_PADDING,
		},
		divider: { borderTopWidth: borders.hairline, borderTopColor: colors.hairline },
		badge: {
			width: BADGE,
			height: BADGE,
			borderRadius: BADGE_RADIUS,
			alignItems: "center" as const,
			justifyContent: "center" as const,
		},
		win: { backgroundColor: colors.winSoft },
		loss: { backgroundColor: colors.lossSoft },
		badgeText: { fontFamily: fonts.extrabold, fontSize: sizes.label },
		winText: { color: colors.statusSuccess },
		lossText: { color: colors.statusDanger },
		week: { flex: 1, fontFamily: fonts.semibold, fontSize: sizes.sm, color: colors.textSecondary },
		score: { fontFamily: fonts.bold, fontSize: sizes.sm, color: colors.textSecondary },
		scoreWin: { color: colors.ink.white },
		times: { fontFamily: fonts.medium, fontSize: sizes.xs, color: colors.textTertiary },
	};
};

// Resultado das últimas semanas contra o rival (V = vitória, D = derrota).
export const HeadToHead: React.FC<{ weeks: IViradaView["headToHead"] }> = ({ weeks }) => {
	const { theme } = useTheme();
	const styles = createHeadToHeadStyles(theme);

	return (
		<GlassCard padding={theme.pace.spacing[1.5]}>
			{weeks.map((h, i) => {
				const isWin = h.us > h.them;
				return (
					<View key={h.week} style={[styles.row, i > 0 ? styles.divider : null]}>
						<View style={[styles.badge, isWin ? styles.win : styles.loss]}>
							<Text style={[styles.badgeText, isWin ? styles.winText : styles.lossText]}>
								{isWin ? VIRADA_COPY.win : VIRADA_COPY.loss}
							</Text>
						</View>
						<Text style={styles.week}>{h.week}</Text>
						<Text style={[styles.score, isWin ? styles.scoreWin : null]}>{formatPoints(h.us)}</Text>
						<Text style={styles.times}>×</Text>
						<Text style={[styles.score, isWin ? null : styles.scoreWin]}>
							{formatPoints(h.them)}
						</Text>
					</View>
				);
			})}
		</GlassCard>
	);
};
