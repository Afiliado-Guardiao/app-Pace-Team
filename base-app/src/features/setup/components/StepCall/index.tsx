import React from "react";
import { Pressable, Text, View } from "react-native";

import { BUDDY_H, BUDDY_W, BuddyFigure, IBuddyPose } from "@/components/buddy";
import { Button, GlassCard, Icon, SegmentedControl } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { SETUP_COPY as C } from "../../constants";
import { useStepCall } from "../../hooks/useStepCall";
import { useWorn } from "../../hooks/useWorn";
import { BuddyBubble } from "../BuddyBubble";
import { PhoneBack } from "../PhoneBack";
import { SubDots } from "../SubDots";

interface IStepCallProps {
	onDone: () => void;
}

const SCALE = 120 / BUDDY_W;
const WAVE: IBuddyPose = { act: "wave", phase: null, blink: false, gx: 0, gy: 0 };
const PHONE = { w: 92, h: 168 } as const;
const MIC = 84;

const createStepCallStyles = (theme: ITheme) => {
	const { colors, spacing, typography, radii } = theme.pace;
	return {
		root: { gap: spacing[4] },
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 26,
			color: colors.textPrimary,
			textAlign: "center" as const,
		},
		scene: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			gap: spacing[5],
			minHeight: 190,
		},
		buddyCol: { alignItems: "center" as const, gap: spacing[2] },
		buddy: { width: BUDDY_W * SCALE, height: BUDDY_H * SCALE },
		buddyInner: {
			position: "absolute" as const,
			transform: [{ scale: SCALE }],
			transformOrigin: "0% 0%",
		},
		phone: {
			width: PHONE.w,
			height: PHONE.h,
			borderRadius: 22,
			borderWidth: 1.5,
			borderColor: colors.glassBorderStrong,
			backgroundColor: colors.glass2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
		},
		badge: {
			paddingHorizontal: spacing[3],
			paddingVertical: 4,
			borderRadius: radii.pill,
			backgroundColor: colors.accent,
		},
		badgeText: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.sm,
			color: colors.onAccent,
		},
		mic: {
			width: MIC,
			height: MIC,
			borderRadius: MIC / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: colors.glass2,
			borderWidth: 1,
			borderColor: colors.glassBorderStrong,
		},
		micOn: { borderColor: colors.accent, boxShadow: theme.pace.shadows.glowAccentOuter },
		text: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.ui,
			lineHeight: 22,
			color: colors.textPrimary,
			textAlign: "center" as const,
		},
		hint: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
			textAlign: "center" as const,
		},
		phrases: { gap: spacing[2] },
		phrase: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[2] },
		phraseText: {
			flex: 1,
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		accent: colors.orange[400],
	};
};

// 3b · "Me chame quando quiser": toque duplo atrás do celular ou a Siri
export const StepCall: React.FC<IStepCallProps> = ({ onDone }) => {
	const { theme } = useTheme();
	const worn = useWorn();
	const styles = createStepCallStyles(theme);
	const call = useStepCall();
	const isTap = call.mode === "tap";

	return (
		<View style={styles.root}>
			<View>
				<Text style={styles.title}>{C.callTitle}</Text>
				<Text style={styles.hint}>{C.callSub}</Text>
			</View>
			<SegmentedControl
				options={[
					{ value: "tap", label: C.callTap },
					{ value: "siri", label: C.callSiri },
				]}
				value={call.mode}
				onChange={(value) => {
					call.setMode(value === "siri" ? "siri" : "tap");
				}}
			/>
			<View style={styles.scene}>
				{isTap ? (
					<PhoneBack beat={call.tapBeat} />
				) : (
					<View style={[styles.mic, call.isListening ? styles.micOn : null]}>
						<Icon name="mic" size={34} color={styles.accent} />
					</View>
				)}
				<View style={styles.buddyCol}>
					<BuddyBubble text={call.bubble} />
					<View style={styles.buddy} pointerEvents="none">
						<View style={styles.buddyInner}>
							<BuddyFigure pose={WAVE} color="branco" accessories={worn} />
						</View>
					</View>
				</View>
			</View>
			{isTap ? (
				<View>
					<Text style={styles.text}>{C.callTapText}</Text>
					<Text style={styles.hint}>{C.callTapHint}</Text>
				</View>
			) : (
				<View style={styles.phrases}>
					<Text style={styles.hint}>{C.callSiriText}</Text>
					{C.callPhrases.map((p, i) => (
						<Pressable
							key={p.say}
							onPress={() => {
								call.say(i);
							}}
							accessibilityRole="button"
							accessibilityLabel={p.say}
							testID={`setup-siri-${String(i)}`}
						>
							<GlassCard>
								<View style={styles.phrase}>
									<Icon name="audio-lines" size={18} color={styles.accent} />
									<Text style={styles.phraseText}>{`“${p.say}”`}</Text>
								</View>
							</GlassCard>
						</Pressable>
					))}
				</View>
			)}
			<SubDots index={1} />
			<Button
				size="lg"
				fullWidth
				iconRight="chevron-right"
				onPress={onDone}
				testID="setup-call-cta"
			>
				{C.callCta}
			</Button>
		</View>
	);
};
