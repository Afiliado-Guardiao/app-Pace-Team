import React from "react";
import { Text, View } from "react-native";

import { BuddyFigure } from "@/components/buddy";
import { GlassCard, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { useBuddyLook } from "@/lib/buddy/useBuddyLook";
import { formatDurationText, formatPace } from "@/lib/pace";
import { IRouteComparison } from "@/lib/run";

interface IRouteCompareCardProps {
	comparison: IRouteComparison;
	// "Ter, 27 out" — quando foi a vez anterior
	previousDate: string;
}

const BUDDY_SCALE = 0.46;
const COPY = {
	title: "Mesmo percurso de ",
	faster: " mais rápido",
	slower: " mais lento",
	tie: "Mesmo tempo da última vez",
	now: " agora · ",
	before: " antes",
	cheerFast: "Recorde no percurso! Você está voando 🎉",
	cheerSlow: "Quase! Na próxima você bate o seu tempo.",
	cheerTie: "Empatou com você mesmo. Bora superar!",
} as const;

const createRouteCompareStyles = (theme: ITheme, isFaster: boolean, isTie: boolean) => {
	const { colors, typography } = theme.pace;
	const tone = isTie ? colors.textSecondary : isFaster ? colors.statusSuccess : colors.statusDanger;
	return {
		row: { flexDirection: "row" as const, alignItems: "center" as const, gap: 10 },
		body: { flex: 1, minWidth: 0, gap: 3 },
		title: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.label,
			color: colors.textTertiary,
		},
		delta: { flexDirection: "row" as const, alignItems: "center" as const, gap: 6 },
		deltaText: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.h3,
			color: tone,
		},
		sub: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.label,
			color: colors.textSecondary,
		},
		cheer: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		buddy: { width: 140 * BUDDY_SCALE, height: 135 * BUDDY_SCALE },
		figure: { transform: [{ scale: BUDDY_SCALE }], transformOrigin: "0% 0%" },
		tone,
	};
};

// Competir com você mesmo: mesmo percurso, mais rápido (seta verde) ou mais
// lento (seta vermelha) que a última vez, com o Buddy reagindo.
export const RouteCompareCard: React.FC<IRouteCompareCardProps> = ({
	comparison,
	previousDate,
}) => {
	const { theme } = useTheme();
	const look = useBuddyLook();
	const { isFaster, deltaSeconds } = comparison;
	const isTie = deltaSeconds === 0;
	const styles = createRouteCompareStyles(theme, isFaster, isTie);
	const amount = formatDurationText(Math.abs(deltaSeconds));
	const deltaText = isTie ? COPY.tie : `${amount}${isFaster ? COPY.faster : COPY.slower}`;
	const cheer = isTie ? COPY.cheerTie : isFaster ? COPY.cheerFast : COPY.cheerSlow;
	const pose = {
		act: isFaster ? ("celebrate" as const) : ("excited" as const),
		phase: null,
		blink: false,
		gx: 0,
		gy: 0,
	};
	const paces = `${formatPace(comparison.pace)}${COPY.now}${formatPace(comparison.previousPace)}${COPY.before}`;

	return (
		<GlassCard variant={isFaster ? "accent" : undefined}>
			<View style={styles.row}>
				<View style={styles.buddy} pointerEvents="none">
					<View style={styles.figure}>
						<BuddyFigure pose={pose} color={look.color} accessories={look.accessories} />
					</View>
				</View>
				<View style={styles.body}>
					<Text style={styles.title}>{`${COPY.title}${previousDate}`}</Text>
					<View style={styles.delta}>
						{isTie ? null : (
							<Icon
								name={isFaster ? "trending-up" : "trending-down"}
								size={20}
								color={styles.tone}
							/>
						)}
						<Text style={styles.deltaText}>{deltaText}</Text>
					</View>
					<Text style={styles.sub}>{`Ritmo: ${paces}`}</Text>
					<Text style={styles.cheer}>{cheer}</Text>
				</View>
			</View>
		</GlassCard>
	);
};
