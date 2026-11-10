import React from "react";
import { Pressable, Text, View } from "react-native";

import { Button, GlassCard, Icon, Input } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { SETUP_COPY as C } from "../../constants";
import { useStepTeam } from "../../hooks/useStepTeam";

interface IStepTeamProps {
	team: ReturnType<typeof useStepTeam>;
	onSolo: () => void;
}

const DOT = 46;

const createStepTeamStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
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
		option: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[3] },
		dot: {
			width: DOT,
			height: DOT,
			borderRadius: DOT / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
		},
		dotAccent: { backgroundColor: colors.accent },
		dotGlass: { backgroundColor: colors.glass2 },
		body: { flex: 1 },
		optTitle: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		},
		optSub: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		label: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		invite: { gap: spacing[2] },
		row: { flexDirection: "row" as const, gap: spacing[2] },
		half: { flex: 1 },
		link: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.ui,
			color: colors.textSecondary,
			textAlign: "center" as const,
			textDecorationLine: "underline" as const,
		},
		white: colors.onAccent,
	};
};

// 05 · "Sua equipe começa com você": criar, entrar com código ou convite
export const StepTeam: React.FC<IStepTeamProps> = ({ team, onSolo }) => {
	const { theme } = useTheme();
	const styles = createStepTeamStyles(theme);
	const isJoin = team.mode === "join";

	return (
		<View style={styles.root}>
			<View>
				<Text style={styles.title}>{C.teamTitle}</Text>
				<Text style={styles.sub}>{C.teamSub}</Text>
			</View>
			{team.invites.map((inv) => (
				<GlassCard key={inv.id}>
					<View style={styles.invite}>
						<Text style={styles.label}>{`${C.teamInvites}: ${inv.teamName}`}</Text>
						<Text
							style={styles.optSub}
						>{`${inv.city} · ${String(inv.members)} de ${String(inv.size)}`}</Text>
						<View style={styles.row}>
							<View style={styles.half}>
								<Button
									fullWidth
									variant="glass"
									onPress={() => {
										team.answer(inv.id, false);
									}}
									testID="setup-invite-decline"
								>
									{C.teamDecline}
								</Button>
							</View>
							<View style={styles.half}>
								<Button
									fullWidth
									disabled={team.isBusy}
									onPress={() => {
										team.answer(inv.id, true);
									}}
									testID="setup-invite-accept"
								>
									{C.teamAccept}
								</Button>
							</View>
						</View>
					</View>
				</GlassCard>
			))}
			{isJoin ? (
				<GlassCard>
					<View style={styles.invite}>
						<Input
							label={C.teamCode}
							icon="ticket"
							value={team.code}
							placeholder="ABCD1234"
							onChangeText={team.setCode}
							testID="setup-team-code"
						/>
						<Button
							fullWidth
							disabled={team.code.length < 8 || team.isBusy}
							onPress={team.join}
							testID="setup-team-join"
						>
							{`${C.teamCodeCta}${team.code}`}
						</Button>
						<Button
							fullWidth
							variant="ghost"
							onPress={team.closeJoin}
							testID="setup-team-join-back"
						>
							{C.back}
						</Button>
					</View>
				</GlassCard>
			) : (
				<>
					<Pressable
						onPress={team.create}
						accessibilityRole="button"
						accessibilityLabel={C.teamCreate}
						testID="setup-team-create"
					>
						<GlassCard>
							<View style={styles.option}>
								<View style={[styles.dot, styles.dotAccent]}>
									<Icon name="flag" size={22} color={styles.white} />
								</View>
								<View style={styles.body}>
									<Text style={styles.optTitle}>{C.teamCreate}</Text>
									<Text style={styles.optSub}>{C.teamCreateSub}</Text>
								</View>
								<Icon name="chevron-right" size={20} />
							</View>
						</GlassCard>
					</Pressable>
					<Pressable
						onPress={team.openJoin}
						accessibilityRole="button"
						accessibilityLabel={C.teamJoin}
						testID="setup-team-open-join"
					>
						<GlassCard>
							<View style={styles.option}>
								<View style={[styles.dot, styles.dotGlass]}>
									<Icon name="ticket" size={22} />
								</View>
								<View style={styles.body}>
									<Text style={styles.optTitle}>{C.teamJoin}</Text>
									<Text style={styles.optSub}>{C.teamJoinSub}</Text>
								</View>
								<Icon name="chevron-right" size={20} />
							</View>
						</GlassCard>
					</Pressable>
				</>
			)}
			<Text style={styles.link} onPress={onSolo} accessibilityRole="link" testID="setup-team-solo">
				{C.teamSolo}
			</Text>
		</View>
	);
};
