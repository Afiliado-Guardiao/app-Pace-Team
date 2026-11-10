import React from "react";
import { Text, View } from "react-native";

import { BUDDY_H, BUDDY_W, BuddyFigure, IBuddyPose } from "@/components/buddy";
import { Button, Icon, Input } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { openLegalPage } from "@/constants/legal";

import { SETUP_COPY as C } from "../../constants";
import { useStepProfile } from "../../hooks/useStepProfile";
import { BuddyBubble } from "../BuddyBubble";

interface IStepProfileProps {
	profile: ReturnType<typeof useStepProfile>;
}

const SCALE = 92 / BUDDY_W;
const WAVE: IBuddyPose = { act: "wave", phase: null, blink: false, gx: 0, gy: 0 };
// Antes de escolher o presente, o Buddy aparece de óculos escuros (como no design)
const SHADES = ["oculos"] as const;

const createStepProfileStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { gap: spacing[4] },
		hello: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[2] },
		buddy: { width: BUDDY_W * SCALE, height: BUDDY_H * SCALE },
		buddyInner: {
			position: "absolute" as const,
			transform: [{ scale: SCALE }],
			transformOrigin: "0% 0%",
		},
		bubble: { flex: 1 },
		title: { fontFamily: typography.fonts.extrabold, fontSize: 28, color: colors.textPrimary },
		sub: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			color: colors.textSecondary,
		},
		divider: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[2] },
		line: { flex: 1, height: 1, backgroundColor: colors.hairline },
		dividerText: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.micro,
			letterSpacing: 1.4,
			color: colors.textTertiary,
		},
		status: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: 6,
			marginTop: -spacing[2],
		},
		ok: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.statusSuccess,
		},
		bad: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.statusDanger,
		},
		legal: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
			textAlign: "center" as const,
		},
		link: { color: colors.orange[400] },
		green: colors.statusSuccess,
		red: colors.statusDanger,
	};
};

// 02 · "Crie sua conta": o Buddy pergunta o nome e responde enquanto digita
export const StepProfile: React.FC<IStepProfileProps> = ({ profile }) => {
	const { theme } = useTheme();
	const styles = createStepProfileStyles(theme);

	return (
		<View style={styles.root}>
			<View style={styles.hello}>
				<View style={styles.buddy} pointerEvents="none">
					<View style={styles.buddyInner}>
						<BuddyFigure pose={WAVE} color="branco" accessories={SHADES} />
					</View>
				</View>
				<View style={styles.bubble}>
					<BuddyBubble text={profile.bubble} tail="left" />
				</View>
			</View>
			<View>
				<Text style={styles.title}>{C.profileTitle}</Text>
				<Text style={styles.sub}>{C.profileSub}</Text>
			</View>
			<View style={styles.divider}>
				<View style={styles.line} />
				<Text style={styles.dividerText}>{C.profileSection}</Text>
				<View style={styles.line} />
			</View>
			<Input
				label={C.profileName}
				icon="user"
				value={profile.name}
				placeholder={C.profileNameHint}
				onChangeText={profile.setName}
				testID="setup-profile-name"
			/>
			<Input
				label={C.profileHandle}
				icon="at-sign"
				value={profile.handle}
				placeholder="lucas.corre"
				onChangeText={profile.setHandle}
				testID="setup-profile-handle"
			/>
			{profile.isFree === null ? null : (
				<View style={styles.status}>
					<Icon
						name={profile.isFree ? "circle-check" : "circle-x"}
						size={14}
						color={profile.isFree ? styles.green : styles.red}
					/>
					<Text style={profile.isFree ? styles.ok : styles.bad}>
						{`@${profile.handle}${profile.isFree ? C.profileFree : C.profileUsed}`}
					</Text>
				</View>
			)}
			<Button
				size="lg"
				fullWidth
				iconRight="chevron-right"
				disabled={!profile.isValid || profile.isBusy}
				onPress={profile.submit}
				testID="setup-profile-cta"
			>
				{C.next}
			</Button>
			<Text style={styles.legal}>
				{C.profileLegalA}
				<Text
					style={styles.link}
					onPress={() => {
						openLegalPage("terms");
					}}
				>
					{C.profileTerms}
				</Text>
				{C.profileLegalB}
				<Text
					style={styles.link}
					onPress={() => {
						openLegalPage("privacy");
					}}
				>
					{C.profilePrivacy}
				</Text>
				.
			</Text>
		</View>
	);
};
