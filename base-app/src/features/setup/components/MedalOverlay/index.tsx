import React from "react";
import { Image, Modal, Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { BUDDY_H, BUDDY_W, BuddyFigure, IBuddyPose } from "@/components/buddy";
import { Button, GlassCard } from "@/components/pace";
import { Confetti } from "@/components/shared/Confetti";
import { ITheme, useTheme } from "@/theme";

import medal from "../../../../../assets/prizes/medal-comprometimento.png";
import { SETUP_COPY as C } from "../../constants";
import { useMedalOverlay } from "../../hooks/useMedalOverlay";
import { useWorn } from "../../hooks/useWorn";

interface IMedalOverlayProps {
	open: boolean;
	onDone: () => void;
}

const MEDAL_H = 168;
const MEDAL_W = MEDAL_H * (692 / 913);
const BUDDY = 84 / BUDDY_W;
const BAR_H = 10;
const JUMP: IBuddyPose = { act: "celebrate", phase: null, blink: false, gx: 0, gy: 0 };

const createMedalOverlayStyles = (theme: ITheme) => {
	const { colors, spacing, typography, radii } = theme.pace;
	return {
		dim: {
			flex: 1,
			backgroundColor: "rgba(4,10,18,.72)",
			justifyContent: "center" as const,
			padding: spacing[5],
		},
		card: { alignItems: "center" as const, gap: spacing[3] },
		rays: {
			position: "absolute" as const,
			top: 0,
			width: 230,
			height: 230,
			borderRadius: 115,
			backgroundColor: "rgba(255,201,77,.16)",
			boxShadow: "0 0 60px 10px rgba(255,201,77,.35)",
		},
		medal: { width: MEDAL_W, height: MEDAL_H },
		buddy: {
			position: "absolute" as const,
			right: 0,
			top: MEDAL_H - 60,
			width: BUDDY_W * BUDDY,
			height: BUDDY_H * BUDDY,
		},
		buddyInner: {
			position: "absolute" as const,
			transform: [{ scale: BUDDY }],
			transformOrigin: "0% 0%",
		},
		label: {
			fontFamily: typography.fonts.bold,
			fontSize: 11,
			letterSpacing: 1.5,
			color: colors.semantic.gold,
		},
		title: { fontFamily: typography.fonts.extrabold, fontSize: 22, color: colors.textPrimary },
		text: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			color: colors.textSecondary,
			textAlign: "center" as const,
		},
		level: { alignSelf: "stretch" as const, gap: 6 },
		levelText: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			color: colors.textPrimary,
		},
		track: {
			height: BAR_H,
			borderRadius: radii.pill,
			backgroundColor: colors.barTrack,
			overflow: "hidden" as const,
		},
		fill: { height: BAR_H, borderRadius: radii.pill, backgroundColor: colors.accent },
	};
};

// 06 · overlay da primeira medalha: confete, raios dourados, a medalha com
// mola e a barra de nível da equipe subindo de 35% para 100%
export const MedalOverlay: React.FC<IMedalOverlayProps> = ({ open, onDone }) => {
	const { theme } = useTheme();
	const worn = useWorn();
	const styles = createMedalOverlayStyles(theme);
	const anim = useMedalOverlay(open);

	return (
		<Modal visible={open} transparent animationType="fade" onRequestClose={onDone}>
			<View style={styles.dim}>
				<Confetti height={800} />
				<GlassCard>
					<View style={styles.card}>
						<View style={styles.rays} />
						<Animated.View style={anim.medal}>
							<Image source={medal} style={styles.medal} resizeMode="contain" />
						</Animated.View>
						<View style={styles.buddy} pointerEvents="none">
							<View style={styles.buddyInner}>
								<BuddyFigure pose={JUMP} color="branco" accessories={worn} />
							</View>
						</View>
						<Text style={styles.label}>{C.medalLabel}</Text>
						<Text style={styles.title}>{C.medalTitle}</Text>
						<Text style={styles.text}>{C.medalText}</Text>
						<View style={styles.level}>
							<Text style={styles.levelText}>{anim.levelText}</Text>
							<View style={styles.track}>
								<Animated.View style={[styles.fill, anim.bar]} />
							</View>
						</View>
						<Button fullWidth size="lg" onPress={onDone} testID="setup-medal-cta">
							{C.medalCta}
						</Button>
					</View>
				</GlassCard>
			</View>
		</Modal>
	);
};
