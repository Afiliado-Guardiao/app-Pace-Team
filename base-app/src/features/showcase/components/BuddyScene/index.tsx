import React from "react";
import { Image, Text, View } from "react-native";

import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";

import { BUDDY_H, BUDDY_W, BuddyFigure, IBuddyPose } from "@/components/buddy";
import { Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import symbol from "../../../../../assets/brand/symbol.png";
import { SHOWCASE_COPY as C } from "../../constants";
import { useBuddyScene } from "../../hooks/useBuddyScene";

const SCALE = 70 / BUDDY_W;
const WAVE: IBuddyPose = { act: "wave", phase: null, blink: false, gx: 0, gy: 0 };
const CELEBRATE: IBuddyPose = { ...WAVE, act: "celebrate" };
const SHADES = ["oculos"] as const;

const createBuddySceneStyles = (theme: ITheme) => {
	const { colors, typography, radii } = theme.pace;
	const fill = { position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0 };
	return {
		fill,
		back: {
			...fill,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			gap: 8,
			backgroundColor: colors.slate[800],
		},
		cam: {
			position: "absolute" as const,
			top: 14,
			left: 14,
			width: 50,
			height: 50,
			borderRadius: 14,
			backgroundColor: colors.glass3,
		},
		symbol: { width: 54, height: 33 },
		tap: {
			paddingHorizontal: 10,
			paddingVertical: 3,
			borderRadius: radii.pill,
			backgroundColor: colors.accent,
		},
		tapText: { fontFamily: typography.fonts.extrabold, fontSize: 12, color: colors.onAccent },
		dim: { ...fill, backgroundColor: "rgba(4,10,18,.55)" },
		lock: { ...fill, alignItems: "center" as const, paddingTop: 40 },
		date: { fontFamily: typography.fonts.semibold, fontSize: 11, color: colors.textSecondary },
		time: { fontFamily: typography.fonts.bold, fontSize: 52, color: colors.textPrimary },
		buddy: { width: BUDDY_W * SCALE, height: BUDDY_H * SCALE, marginTop: 4 },
		buddyInner: {
			position: "absolute" as const,
			transform: [{ scale: SCALE }],
			transformOrigin: "0% 0%",
		},
		card: {
			position: "absolute" as const,
			left: 10,
			right: 10,
			bottom: 12,
			gap: 6,
			padding: 10,
			borderRadius: 18,
			backgroundColor: colors.glassPanel,
			borderWidth: 1,
			borderColor: colors.glassBorder,
		},
		cardTitle: { fontFamily: typography.fonts.extrabold, fontSize: 16, color: colors.textPrimary },
		cardSub: { fontFamily: typography.fonts.medium, fontSize: 9, color: colors.textSecondary },
		opt: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: 6,
			padding: 6,
			borderRadius: 10,
			backgroundColor: colors.glass1,
		},
		optOn: { backgroundColor: colors.accent },
		optText: { fontFamily: typography.fonts.bold, fontSize: 10, color: colors.textPrimary },
		later: {
			fontFamily: typography.fonts.semibold,
			fontSize: 9,
			color: colors.textTertiary,
			textAlign: "center" as const,
		},
	};
};

// Cena "Chame o Buddy": traseira com os 2 toques → tela de bloqueio → o
// Buddy acena → card "Bora correr?" → toque em "Correr com a equipe"
export const BuddyScene: React.FC = () => {
	const { theme } = useTheme();
	const styles = createBuddySceneStyles(theme);
	const { phase, taps } = useBuddyScene();
	const isPick = phase === "pick";

	if (phase === "back") {
		return (
			<View style={styles.back}>
				<View style={styles.cam} />
				<Image source={symbol} style={styles.symbol} resizeMode="contain" />
				{taps > 0 ? (
					<Animated.View entering={ZoomIn} key={taps} style={styles.tap}>
						<Text style={styles.tapText}>{`${String(taps)}×`}</Text>
					</Animated.View>
				) : null}
			</View>
		);
	}

	return (
		<Animated.View entering={FadeIn} style={styles.fill}>
			<Image source={PHOTOS.runnerMountain} style={styles.fill} resizeMode="cover" blurRadius={8} />
			<View style={styles.dim} />
			<View style={styles.lock}>
				<Text style={styles.date}>{C.lockDate}</Text>
				<Text style={styles.time}>{C.lockTime}</Text>
				{phase === "lock" ? null : (
					<Animated.View entering={ZoomIn.springify()} style={styles.buddy}>
						<View style={styles.buddyInner}>
							<BuddyFigure pose={isPick ? CELEBRATE : WAVE} color="branco" accessories={SHADES} />
						</View>
					</Animated.View>
				)}
			</View>
			{phase === "card" || isPick ? (
				<Animated.View entering={FadeInDown} style={styles.card}>
					<Text style={styles.cardTitle}>{C.cardTitle}</Text>
					<Text style={styles.cardSub}>{C.cardSub}</Text>
					<View style={styles.opt}>
						<Icon name="footprints" size={12} />
						<Text style={styles.optText}>{C.cardSolo}</Text>
					</View>
					<View style={[styles.opt, isPick ? styles.optOn : null]}>
						<Icon name="users" size={12} />
						<Text style={styles.optText}>{C.cardTeam}</Text>
					</View>
					<View style={styles.opt}>
						<Icon name="target" size={12} />
						<Text style={styles.optText}>{C.cardGoal}</Text>
					</View>
					<Text style={styles.later}>{C.cardLater}</Text>
				</Animated.View>
			) : null}
		</Animated.View>
	);
};
