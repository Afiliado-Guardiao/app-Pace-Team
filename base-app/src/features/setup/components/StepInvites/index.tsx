import React from "react";
import { Text, View } from "react-native";

import { Avatar, Badge, Button, GlassCard } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { ITeamView } from "@/lib/data";

import { SETUP_COPY as C } from "../../constants";

interface IStepInvitesProps {
	team: ITeamView | null;
	onInvite: () => void;
	onFinish: () => void;
}

const createStepInvitesStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { gap: spacing[4] },
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 26,
			color: colors.textPrimary,
			textAlign: "center" as const,
		},
		card: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[3] },
		body: { flex: 1, gap: 2 },
		name: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.lg,
			color: colors.textPrimary,
		},
		sub: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		count: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.lg,
			color: colors.textPrimary,
		},
		members: { gap: spacing[2] },
		member: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[2] },
		memberName: {
			flex: 1,
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		note: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
			textAlign: "center" as const,
		},
	};
};

// 06 · "Convide seus amigos": a equipe, quem já entrou e o atalho de convite
export const StepInvites: React.FC<IStepInvitesProps> = ({ team, onInvite, onFinish }) => {
	const { theme } = useTheme();
	const styles = createStepInvitesStyles(theme);
	const captain = team?.members.find((m) => m.role === "Capitão")?.name ?? "";
	const count = `${String(team?.members.length ?? 1)}/${String(team?.size ?? 10)}`;

	return (
		<View style={styles.root}>
			<Text style={styles.title}>{C.invitesTitle}</Text>
			<GlassCard>
				<View style={styles.card}>
					<Avatar name={team?.name ?? ""} src={team?.logoUrl ?? undefined} size={56} />
					<View style={styles.body}>
						<Text style={styles.name}>{team?.name}</Text>
						<Text style={styles.sub}>{`${C.invitesCaptain}${captain}`}</Text>
					</View>
					<Text style={styles.count}>{count}</Text>
				</View>
			</GlassCard>
			<GlassCard>
				<View style={styles.members}>
					{(team?.members ?? []).map((m) => (
						<View key={m.name} style={styles.member}>
							<Avatar name={m.name} size={32} />
							<Text style={styles.memberName}>{m.name}</Text>
							<Badge tone={m.role === "Capitão" ? "accent" : "success"}>
								{m.role === "Capitão" ? "Capitão" : "Entrou"}
							</Badge>
						</View>
					))}
				</View>
			</GlassCard>
			<Button
				size="lg"
				fullWidth
				variant="glass"
				icon="user-plus"
				onPress={onInvite}
				testID="setup-invites-open"
			>
				{C.invitesOpen}
			</Button>
			<Text style={styles.note}>{C.invitesNote}</Text>
			<Button
				size="lg"
				fullWidth
				iconRight="chevron-right"
				onPress={onFinish}
				testID="setup-invites-cta"
			>
				{C.invitesCta}
			</Button>
		</View>
	);
};
