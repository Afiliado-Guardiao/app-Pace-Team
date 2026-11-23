import React from "react";
import { Text, View } from "react-native";

import Svg, { Circle } from "react-native-svg";

import { BUDDY_H, BUDDY_W, BuddyFigure, IBuddyPose } from "@/components/buddy";
import { Chip, GlassCard } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { formatMl, IUseHydrationReturn } from "@/lib/hydration";

import { HYDRO_COPY as C, QUICK_ML } from "../../constants";

interface IHydroTodayProps {
	hydro: IUseHydrationReturn;
	onAdd: (ml: number) => void;
	onOther: () => void;
	onEditData: () => void;
}

const RING = 168;
const STROKE = 12;
const R = (RING - STROKE) / 2;
const LEN = 2 * Math.PI * R;
const BUD_SCALE = 0.5;

const createHydroTodayStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { alignItems: "center" as const, gap: spacing[3] },
		ring: {
			width: RING,
			height: RING,
			alignItems: "center" as const,
			justifyContent: "center" as const,
		},
		bud: {
			position: "absolute" as const,
			top: 14,
			left: (RING - BUDDY_W * BUD_SCALE) / 2,
			width: BUDDY_W * BUD_SCALE,
			height: BUDDY_H * BUD_SCALE,
		},
		budInner: {
			position: "absolute" as const,
			transform: [{ scale: BUD_SCALE }],
			transformOrigin: "0% 0%",
		},
		amount: {
			marginTop: 52,
			fontFamily: typography.numericFonts.bold,
			fontSize: 26,
			color: colors.textPrimary,
		},
		of: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		line: {
			textAlign: "center" as const,
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		sub: {
			textAlign: "center" as const,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
		},
		link: { color: colors.textAccent },
		chips: {
			flexDirection: "row" as const,
			flexWrap: "wrap" as const,
			gap: spacing[2],
			justifyContent: "center" as const,
		},
		track: colors.trackEmpty,
	};
};

const poseOf = (hydro: IUseHydrationReturn): IBuddyPose => ({
	act: hydro.isThirsty ? "thirsty" : hydro.progress >= 1 ? "celebrate" : "idle",
	phase: null,
	blink: false,
	gx: 0,
	gy: 0,
});

const statusLine = (hydro: IUseHydrationReturn): string => {
	if (hydro.targetMl === null) return C.restricted;
	return hydro.remainingMl > 0 ? C.remaining(formatMl(hydro.remainingMl)) : C.reached;
};

// O dia em um anel: quanto já bebeu, a estimativa de hoje e o Bud (com sede
// quando falta muito para o horário); embaixo, os copos rápidos
export const HydroToday: React.FC<IHydroTodayProps> = ({ hydro, onAdd, onOther, onEditData }) => {
	const { theme } = useTheme();
	const styles = createHydroTodayStyles(theme);
	const runsMl = hydro.runsToday.reduce((s, r) => s + r.hydration.replaceMl, 0);
	const target = hydro.targetMl;

	return (
		<GlassCard testID="hydro-today">
			<View style={styles.root}>
				<View style={styles.ring}>
					<Svg width={RING} height={RING} style={{ position: "absolute" }}>
						<Circle
							cx={RING / 2}
							cy={RING / 2}
							r={R}
							stroke={styles.track}
							strokeWidth={STROKE}
							fill="none"
						/>
						{hydro.progress > 0 ? (
							<Circle
								cx={RING / 2}
								cy={RING / 2}
								r={R}
								stroke={theme.pace.colors.water}
								strokeWidth={STROKE}
								fill="none"
								strokeLinecap="round"
								strokeDasharray={`${String(LEN * hydro.progress)} ${String(LEN)}`}
								transform={`rotate(-90 ${String(RING / 2)} ${String(RING / 2)})`}
							/>
						) : null}
					</Svg>
					<View style={styles.bud} pointerEvents="none">
						<View style={styles.budInner}>
							<BuddyFigure pose={poseOf(hydro)} color="branco" accessories={[]} />
						</View>
					</View>
					<Text style={styles.amount}>{formatMl(hydro.drankMl)}</Text>
					{target !== null ? <Text style={styles.of}>{C.of(formatMl(target))}</Text> : null}
				</View>
				<Text style={styles.line}>{statusLine(hydro)}</Text>
				{target !== null ? (
					<Text style={styles.sub}>
						{C.estimateFrom(formatMl(hydro.baseMl), runsMl ? formatMl(runsMl) : "")}
					</Text>
				) : null}
				{hydro.needsBody ? (
					<Text style={[styles.sub, styles.link]} onPress={onEditData} accessibilityRole="button">
						{C.noWeight}
					</Text>
				) : null}
				<View style={styles.chips}>
					{QUICK_ML.map((ml) => (
						<Chip
							key={ml}
							icon="glass-water"
							onPress={() => {
								onAdd(ml);
							}}
							testID={`hydro-add-${String(ml)}`}
						>
							{`${String(ml)} ml`}
						</Chip>
					))}
					<Chip icon="plus" onPress={onOther} testID="hydro-add-other">
						{C.other}
					</Chip>
				</View>
			</View>
		</GlassCard>
	);
};
