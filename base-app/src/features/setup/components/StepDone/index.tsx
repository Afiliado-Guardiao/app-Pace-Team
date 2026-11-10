import React from "react";
import { Image, Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { BUDDY_H, BUDDY_W, BuddyFigure, IBuddyPose } from "@/components/buddy";
import { Avatar, Button, Chip, GlassCard, Icon } from "@/components/pace";
import { Confetti } from "@/components/shared/Confetti";
import { ITheme, useTheme } from "@/theme";

import medal from "../../../../../assets/prizes/medal-comprometimento.png";
import { SETUP_COPY as C } from "../../constants";
import { useDropMedal } from "../../hooks/useDropMedal";
import { useWorn } from "../../hooks/useWorn";

interface IStepDoneProps {
	name: string;
	handle: string;
	chips: readonly string[];
	hasMedal: boolean;
	onFinish: () => void;
}

const STAGE = { w: 280, h: 252 } as const;
const BUDDY = 150 / BUDDY_W;
const MEDAL_H = 110;
const CELEBRATE: IBuddyPose = { act: "celebrate", phase: null, blink: false, gx: 0, gy: 0 };

const createStepDoneStyles = (theme: ITheme) => {
	const { colors, spacing, typography, radii } = theme.pace;
	return {
		root: { gap: spacing[4] },
		badge: {
			alignSelf: "center" as const,
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: 6,
			paddingHorizontal: spacing[3],
			paddingVertical: 6,
			borderRadius: radii.pill,
			backgroundColor: colors.statusSuccessSoft,
		},
		badgeText: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.sm,
			color: colors.statusSuccess,
		},
		stage: {
			alignSelf: "center" as const,
			width: STAGE.w,
			height: STAGE.h,
			alignItems: "center" as const,
			justifyContent: "flex-end" as const,
		},
		glow: {
			position: "absolute" as const,
			width: STAGE.w,
			height: STAGE.w,
			top: 0,
			borderRadius: STAGE.w / 2,
			backgroundColor: colors.accentSoft,
			boxShadow: "0 0 80px 10px rgba(253,90,12,.30)",
		},
		buddy: { width: BUDDY_W * BUDDY, height: BUDDY_H * BUDDY, marginRight: 70 },
		buddyInner: {
			position: "absolute" as const,
			transform: [{ scale: BUDDY }],
			transformOrigin: "0% 0%",
		},
		medal: { position: "absolute" as const, right: 18, bottom: 10 },
		medalImg: { width: MEDAL_H * (692 / 913), height: MEDAL_H },
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 26,
			color: colors.textPrimary,
			textAlign: "center" as const,
		},
		sub: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			color: colors.textSecondary,
			textAlign: "center" as const,
		},
		card: { gap: spacing[3] },
		who: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[3] },
		name: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		},
		handle: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		chips: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: spacing[2] },
		ok: colors.statusSuccess,
	};
};

// 08 · "Tudo pronto!": confete, o Buddy comemorando e a medalha caindo do alto
export const StepDone: React.FC<IStepDoneProps> = ({ name, handle, chips, hasMedal, onFinish }) => {
	const { theme } = useTheme();
	const worn = useWorn();
	const styles = createStepDoneStyles(theme);
	const drop = useDropMedal();

	return (
		<View style={styles.root}>
			<Confetti height={900} />
			<View style={styles.badge}>
				<Icon name="check" size={16} color={styles.ok} />
				<Text style={styles.badgeText}>{C.doneBadge}</Text>
			</View>
			<View style={styles.stage}>
				<View style={styles.glow} />
				<View style={styles.buddy} pointerEvents="none">
					<View style={styles.buddyInner}>
						<BuddyFigure pose={CELEBRATE} color="branco" accessories={worn} />
					</View>
				</View>
				{hasMedal ? (
					<Animated.View style={[styles.medal, drop]}>
						<Image source={medal} style={styles.medalImg} resizeMode="contain" />
					</Animated.View>
				) : null}
			</View>
			<View>
				<Text style={styles.title}>{C.doneTitle}</Text>
				<Text style={styles.sub}>{C.doneSub}</Text>
			</View>
			<GlassCard>
				<View style={styles.card}>
					<View style={styles.who}>
						<Avatar name={name} size={44} />
						<View>
							<Text style={styles.name}>{name}</Text>
							<Text style={styles.handle}>{handle}</Text>
						</View>
					</View>
					<View style={styles.chips}>
						{chips.map((c) => (
							<Chip key={c}>{c}</Chip>
						))}
					</View>
				</View>
			</GlassCard>
			<Button
				size="lg"
				fullWidth
				iconRight="chevron-right"
				onPress={onFinish}
				testID="setup-done-cta"
			>
				{C.doneCta}
			</Button>
		</View>
	);
};
