import React from "react";
import { Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { GlassCard, GradientLayers, useEntrance } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { IViradaView } from "@/lib/data";

import { VIRADA_COPY, WEEK_DAYS } from "../../constants";

const AREA = 90;
const BAR_W = 9;
const STAGGER = 60;
const RIVAL_OFFSET = 30;
const LEGEND_DOT = 8;
const CHART_TOP = 16;
const CHART_H = 110;

const createWeekDuelStyles = (theme: ITheme) => {
	const { colors, shadows, spacing, typography } = theme.pace;
	const bar = { width: BAR_W, borderRadius: BAR_W / 2, transformOrigin: "bottom" as const };
	return {
		legend: { flexDirection: "row" as const, gap: spacing[3.5], alignItems: "center" as const },
		legendItem: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[1.5] },
		legendText: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		legendUnit: {
			marginLeft: "auto" as const,
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
		},
		dotUs: {
			width: LEGEND_DOT,
			height: LEGEND_DOT,
			borderRadius: 2,
			backgroundColor: colors.orange[500],
		},
		dotThem: {
			width: LEGEND_DOT,
			height: LEGEND_DOT,
			borderRadius: 2,
			backgroundColor: colors.legendRival,
		},
		chart: {
			flexDirection: "row" as const,
			alignItems: "flex-end" as const,
			gap: spacing[2],
			height: CHART_H,
			marginTop: CHART_TOP,
		},
		day: { flex: 1, alignItems: "center" as const, gap: spacing[1.5] },
		pair: { flexDirection: "row" as const, alignItems: "flex-end" as const, gap: 3, height: AREA },
		barUs: { ...bar, overflow: "hidden" as const, boxShadow: shadows.barAccentGlow },
		barThem: { ...bar, backgroundColor: colors.barRival },
		dayLabel: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.micro,
			color: colors.textTertiary,
		},
	};
};

type IStyles = ReturnType<typeof createWeekDuelStyles>;

// Barra que cresce da base com atraso (pt-grow)
const GrowBar: React.FC<{ height: number; delay: number; isUs: boolean; styles: IStyles }> = ({
	height,
	delay,
	isUs,
	styles,
}) => {
	const { theme } = useTheme();
	const grow = useEntrance("grow", { delay });
	return (
		<Animated.View style={[isUs ? styles.barUs : styles.barThem, { height }, grow]}>
			{isUs ? (
				<GradientLayers
					layers={theme.pace.gradients.progressVertical}
					width={BAR_W}
					height={height}
				/>
			) : null}
		</Animated.View>
	);
};

// Pontos por dia: o seu time (laranja) contra o rival (branco).
export const WeekDuel: React.FC<{ virada: IViradaView }> = ({ virada }) => {
	const { theme } = useTheme();
	const styles = createWeekDuelStyles(theme);
	const { week } = virada;
	// Sem pontos na semana: barras zeradas (evita dividir por zero)
	const max = Math.max(1, ...week.us, ...week.them);

	return (
		<GlassCard>
			<View style={styles.legend}>
				<View style={styles.legendItem}>
					<View style={styles.dotUs} />
					<Text style={styles.legendText}>{virada.team.name}</Text>
				</View>
				<View style={styles.legendItem}>
					<View style={styles.dotThem} />
					<Text style={styles.legendText}>{virada.rival.name}</Text>
				</View>
				<Text style={styles.legendUnit}>{VIRADA_COPY.perDay}</Text>
			</View>
			<View style={styles.chart}>
				{WEEK_DAYS.map((day, i) => (
					<View key={i} style={styles.day}>
						<View style={styles.pair}>
							<GrowBar
								height={((week.us[i] ?? 0) / max) * AREA}
								delay={i * STAGGER}
								isUs
								styles={styles}
							/>
							<GrowBar
								height={((week.them[i] ?? 0) / max) * AREA}
								delay={i * STAGGER + RIVAL_OFFSET}
								isUs={false}
								styles={styles}
							/>
						</View>
						<Text style={styles.dayLabel}>{day}</Text>
					</View>
				))}
			</View>
		</GlassCard>
	);
};
