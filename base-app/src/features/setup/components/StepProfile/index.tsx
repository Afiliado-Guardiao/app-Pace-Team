import React from "react";
import { Text, View } from "react-native";

import { BUDDY_H, BUDDY_W, BuddyDots, IBuddyPose } from "@/components/buddy";
import { Button, Icon, Input } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { openLegalPage } from "@/constants/legal";

import { SETUP_COPY as C } from "../../constants";
import { useBudArrival } from "../../hooks/useBudArrival";
import { useStepProfile } from "../../hooks/useStepProfile";
import { BuddyBubble } from "../BuddyBubble";

interface IStepProfileProps {
	profile: ReturnType<typeof useStepProfile>;
}

const SCALE = 92 / BUDDY_W;
const WAVE: IBuddyPose = { act: "wave", phase: null, blink: false, gx: 0, gy: 0 };
// Na criação da conta o Bud ainda não tem nada: o acessório vem depois,
// quando o atleta escolhe o presente
const NO_ACCESSORIES = [] as const;

const createStepProfileStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { gap: spacing[4] },
		hello: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[2] },
		buddy: { width: BUDDY_W * SCALE, height: BUDDY_H * SCALE },
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
	// Chegou voando do Começar: bolinhas "pensando" e depois o Bud
	const arrival = useBudArrival();

	return (
		<View style={styles.root}>
			<View style={styles.hello}>
				<View style={styles.buddy} pointerEvents="none">
					<BuddyDots
						mode={arrival}
						pose={WAVE}
						scale={SCALE}
						accessories={NO_ACCESSORIES}
						label={C.thinking}
					/>
				</View>
				<View style={styles.bubble}>
					{arrival === "bud" ? <BuddyBubble text={profile.bubble} tail="left" /> : null}
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
