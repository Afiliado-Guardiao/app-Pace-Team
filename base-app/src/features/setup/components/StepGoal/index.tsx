import React from "react";
import { Pressable, Text, View } from "react-native";

import { BUDDY_H, BUDDY_W, BuddyFigure, IBuddyPose } from "@/components/buddy";
import { Button, GlassCard, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { GOALS, IGoalId, SETUP_COPY as C } from "../../constants";
import { useWorn } from "../../hooks/useWorn";
import { BuddyBubble } from "../BuddyBubble";

interface IStepGoalProps {
	goal: IGoalId | null;
	onPick: (goal: IGoalId) => void;
	onDone: () => void;
}

const SCALE = 96 / BUDDY_W;
const IDLE: IBuddyPose = { act: "idle", phase: null, blink: false, gx: 0, gy: 0 };
const JUMP: IBuddyPose = { ...IDLE, act: "excited" };
const DOT = 40;

const createStepGoalStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { gap: spacing[4] },
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 26,
			color: colors.textPrimary,
			textAlign: "center" as const,
		},
		stage: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[3] },
		bubble: { flex: 1, alignItems: "flex-start" as const },
		buddy: { width: BUDDY_W * SCALE, height: BUDDY_H * SCALE },
		buddyInner: {
			position: "absolute" as const,
			transform: [{ scale: SCALE }],
			transformOrigin: "0% 0%",
		},
		grid: {
			flexDirection: "row" as const,
			flexWrap: "wrap" as const,
			justifyContent: "space-between" as const,
			rowGap: spacing[3],
		},
		cell: { width: "48%" as const },
		cellOn: { transform: [{ translateY: -3 }] },
		card: { gap: spacing[2], minHeight: 120 },
		dot: {
			width: DOT,
			height: DOT,
			borderRadius: DOT / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: colors.accentSoft,
		},
		dotOn: { backgroundColor: colors.accent },
		check: {
			position: "absolute" as const,
			top: 0,
			right: 0,
			width: 22,
			height: 22,
			borderRadius: 11,
			borderWidth: 1.5,
			borderColor: colors.glassBorderStrong,
			alignItems: "center" as const,
			justifyContent: "center" as const,
		},
		checkOn: { backgroundColor: colors.onAccent, borderColor: colors.onAccent },
		ring: {
			borderRadius: 24,
			boxShadow: "0 0 0 1.5px rgba(255,160,110,.85), 0 0 0 6px rgba(253,90,12,.22)",
		},
		ink: colors.textOnLight,
		cardTitle: { fontFamily: typography.fonts.extrabold, fontSize: 15, color: colors.textPrimary },
		cardSub: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		accent: colors.orange[400],
		white: colors.onAccent,
	};
};

// 04 · "O que você quer conquistar com o PACE?" (2×2, o Buddy comenta)
export const StepGoal: React.FC<IStepGoalProps> = ({ goal, onPick, onDone }) => {
	const { theme } = useTheme();
	const worn = useWorn();
	const styles = createStepGoalStyles(theme);
	const picked = GOALS.find((g) => g.id === goal);

	return (
		<View style={styles.root}>
			<Text style={styles.title}>{C.goalTitle}</Text>
			<View style={styles.stage}>
				<View style={styles.buddy} pointerEvents="none" key={goal ?? "none"}>
					<View style={styles.buddyInner}>
						<BuddyFigure pose={picked ? JUMP : IDLE} color="branco" accessories={worn} />
					</View>
				</View>
				<View style={styles.bubble}>
					<BuddyBubble text={picked?.bubble ?? C.goalBubble} tail="left" />
				</View>
			</View>
			<View style={styles.grid}>
				{GOALS.map((g) => {
					const isOn = g.id === goal;
					return (
						<Pressable
							key={g.id}
							style={[styles.cell, isOn ? styles.cellOn : null, isOn ? styles.ring : null]}
							onPress={() => {
								onPick(g.id);
							}}
							accessibilityRole="button"
							accessibilityLabel={g.title}
							testID={`setup-goal-${g.id}`}
						>
							<GlassCard>
								<View style={styles.card}>
									<View style={[styles.dot, isOn ? styles.dotOn : null]}>
										<Icon name={g.icon} size={20} color={isOn ? styles.white : styles.accent} />
									</View>
									<View style={[styles.check, isOn ? styles.checkOn : null]}>
										{isOn ? <Icon name="check" size={14} color={styles.ink} /> : null}
									</View>
									<Text style={styles.cardTitle}>{g.title}</Text>
									<Text style={styles.cardSub}>{g.sub}</Text>
								</View>
							</GlassCard>
						</Pressable>
					);
				})}
			</View>
			<Button
				size="lg"
				fullWidth
				iconRight="chevron-right"
				disabled={!goal}
				onPress={onDone}
				testID="setup-goal-cta"
			>
				{C.goalCta}
			</Button>
		</View>
	);
};
