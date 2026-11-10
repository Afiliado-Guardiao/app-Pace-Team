import React from "react";
import { Text, View } from "react-native";

import { BUDDY_H, BUDDY_W, BuddyFigure } from "@/components/buddy";
import { Button, GlassCard, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { SETUP_COPY as C } from "../../constants";
import { useStepCare } from "../../hooks/useStepCare";
import { useWorn } from "../../hooks/useWorn";
import { pctWidth } from "../../utils/pct";
import { DaySlider } from "../DaySlider";
import { SubDots } from "../SubDots";

interface IStepCareProps {
	onDone: () => void;
}

const SCALE = 130 / BUDDY_W;
const BAR_H = 12;

const createStepCareStyles = (theme: ITheme) => {
	const { colors, spacing, typography, radii } = theme.pace;
	return {
		root: { gap: spacing[4] },
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 26,
			color: colors.textPrimary,
			textAlign: "center" as const,
		},
		sub: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			lineHeight: 21,
			color: colors.textSecondary,
			textAlign: "center" as const,
		},
		stage: { alignItems: "center" as const, gap: spacing[2] },
		buddy: { width: BUDDY_W * SCALE, height: BUDDY_H * SCALE },
		buddyInner: {
			position: "absolute" as const,
			transform: [{ scale: SCALE }],
			transformOrigin: "0% 0%",
		},
		hearts: { flexDirection: "row" as const, gap: 6, height: 20 },
		track: {
			height: BAR_H,
			borderRadius: radii.pill,
			backgroundColor: colors.barTrack,
			overflow: "hidden" as const,
		},
		fill: { height: BAR_H, borderRadius: radii.pill },
		label: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		box: { gap: spacing[3] },
		moodRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 6 },
		moodText: { flex: 1 },
		moodTitle: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		},
		moodSub: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		lifePct: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		sliderRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[3] },
		dayValue: {
			width: 16,
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
			textAlign: "right" as const,
		},
		safe: { flexDirection: "row" as const, gap: spacing[2], alignItems: "flex-start" as const },
		safeText: {
			flex: 1,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			lineHeight: 17,
			color: colors.textSecondary,
		},
		tones: { good: colors.statusSuccess, warn: colors.semantic.gold, bad: colors.statusDanger },
		heart: colors.statusDanger,
		ok: colors.statusSuccess,
	};
};

// 3c · "Cuide de mim": barra de vida e o Buddy cansado ou doente
export const StepCare: React.FC<IStepCareProps> = ({ onDone }) => {
	const { theme } = useTheme();
	const worn = useWorn();
	const styles = createStepCareStyles(theme);
	const care = useStepCare();
	const hearts = care.hearts > 0 ? [0, 1, 2] : [];

	return (
		<View style={styles.root}>
			<View>
				<Text style={styles.title}>{C.careTitle}</Text>
				<Text style={styles.sub}>{C.careSub}</Text>
			</View>
			<View style={styles.stage}>
				<View style={styles.hearts} key={care.hearts}>
					{hearts.map((n) => (
						<Icon key={n} name="heart" size={18} color={styles.heart} fill={styles.heart} />
					))}
				</View>
				<View style={styles.buddy} pointerEvents="none">
					<View style={styles.buddyInner}>
						<BuddyFigure pose={care.pose} color="branco" accessories={worn} />
					</View>
				</View>
			</View>
			<GlassCard>
				<View style={styles.box}>
					<View style={styles.moodRow}>
						<View style={styles.moodText}>
							<Text style={styles.moodTitle}>{care.mood}</Text>
							<Text style={styles.moodSub}>{care.moodSub}</Text>
						</View>
						<Icon name="heart" size={16} color={styles.tones[care.lifeTone]} />
						<Text style={styles.lifePct}>{`${String(Math.round(care.life * 100))} %`}</Text>
					</View>
					<View style={styles.track}>
						<View
							style={[
								styles.fill,
								{ width: pctWidth(care.life), backgroundColor: styles.tones[care.lifeTone] },
							]}
						/>
					</View>
					<View style={styles.sliderRow}>
						<Text style={styles.label}>{C.careDays}</Text>
						<DaySlider value={care.days} max={7} onChange={care.setDays} />
						<Text style={styles.dayValue}>{care.days}</Text>
					</View>
					<Button
						fullWidth
						variant="glass"
						icon="footprints"
						onPress={care.simulateRun}
						testID="setup-care-run"
					>
						{C.careRun}
					</Button>
				</View>
			</GlassCard>
			<View style={styles.safe}>
				<Icon name="shield-check" size={16} color={styles.ok} />
				<Text style={styles.safeText}>{C.careSafe}</Text>
			</View>
			<SubDots index={2} />
			<Button
				size="lg"
				fullWidth
				iconRight="chevron-right"
				onPress={onDone}
				testID="setup-care-cta"
			>
				{C.next}
			</Button>
		</View>
	);
};
