import React from "react";
import { Text, View } from "react-native";

import { Avatar, Button, GlassCard, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { ITeamView } from "@/lib/data";

import { SETUP_COPY as C } from "../../constants";
import { useStepInvites } from "../../hooks/useStepInvites";
import { InviteTools } from "../InviteTools";

interface IStepInvitesProps {
	team: ITeamView | null;
	inv: ReturnType<typeof useStepInvites>;
	isPro: boolean;
	onFinish: () => void;
}

const MAX_EMPTY = 3;

const createStepInvitesStyles = (theme: ITheme) => {
	const { colors, spacing, typography, radii } = theme.pace;
	const row = {
		flexDirection: "row" as const,
		alignItems: "center" as const,
		gap: spacing[3],
		paddingVertical: spacing[2],
		paddingHorizontal: spacing[3],
		borderRadius: radii.lg,
		backgroundColor: colors.glass1,
	};
	return {
		root: { gap: spacing[4] },
		title: { fontFamily: typography.fonts.extrabold, fontSize: 26, color: colors.textPrimary },
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
		count: { alignItems: "flex-end" as const },
		countText: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.lg,
			color: colors.textPrimary,
		},
		pro: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 9,
			letterSpacing: 1,
			color: colors.orange[400],
		},
		head: { flexDirection: "row" as const, justifyContent: "space-between" as const },
		label: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		list: { gap: spacing[2] },
		row,
		empty: {
			...row,
			backgroundColor: "transparent",
			borderWidth: 1,
			borderStyle: "dashed" as const,
			borderColor: colors.glassBorder,
		},
		rowName: {
			flex: 1,
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		state: { flexDirection: "row" as const, alignItems: "center" as const, gap: 4 },
		stateText: { fontFamily: typography.fonts.bold, fontSize: typography.sizes.xs },
		muted: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.textTertiary,
		},
		link: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.ui,
			color: colors.textSecondary,
			textAlign: "center" as const,
			textDecorationLine: "underline" as const,
		},
		tones: { captain: colors.orange[400], in: colors.statusSuccess, pending: colors.semantic.gold },
	};
};

// 06 · "Convide seus amigos": a equipe, atalhos, busca e quem já entrou
export const StepInvites: React.FC<IStepInvitesProps> = ({ team, inv, isPro, onFinish }) => {
	const { theme } = useTheme();
	const styles = createStepInvitesStyles(theme);
	const captain = team?.members.find((m) => m.role === "Capitão")?.name ?? "";
	const empty = Array.from({ length: Math.min(MAX_EMPTY, inv.left) }, (_, i) => i);

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
					<View style={styles.count}>
						<Text
							style={styles.countText}
						>{`${String(team?.members.length ?? 1)}/${String(team?.size ?? 10)}`}</Text>
						{isPro ? <Text style={styles.pro}>TEAM PRO</Text> : null}
					</View>
				</View>
			</GlassCard>
			<InviteTools inv={inv} />
			<View style={styles.head}>
				<Text style={styles.label}>{C.invitesMembers}</Text>
				<Text style={styles.sub}>{`${String(inv.left)}${C.invitesSlots}`}</Text>
			</View>
			<View style={styles.list}>
				{(team?.members ?? []).map((m) => {
					const isCaptain = m.role === "Capitão";
					const tone = isCaptain ? styles.tones.captain : styles.tones.in;
					return (
						<View key={m.name} style={styles.row}>
							<Avatar name={m.name} src={m.avatarUrl ?? undefined} size={32} />
							<Text style={styles.rowName}>{m.name}</Text>
							<View style={styles.state}>
								<Icon name={isCaptain ? "crown" : "circle-check"} size={14} color={tone} />
								<Text style={[styles.stateText, { color: tone }]}>
									{isCaptain ? C.invitesStateCaptain : C.invitesStateIn}
								</Text>
							</View>
						</View>
					);
				})}
				{inv.pending.map((p) => (
					<View key={p.id} style={styles.row}>
						<Avatar name={p.name} size={32} />
						<Text style={styles.rowName}>{p.name}</Text>
						<View style={styles.state}>
							<Icon name="clock" size={14} color={styles.tones.pending} />
							<Text style={[styles.stateText, { color: styles.tones.pending }]}>
								{C.invitesStatePending}
							</Text>
						</View>
					</View>
				))}
				{empty.map((n) => (
					<View key={n} style={styles.empty}>
						<Icon name="plus" size={16} />
						<Text style={styles.muted}>{C.invitesSlot}</Text>
					</View>
				))}
			</View>
			<Text style={styles.sub}>{C.invitesNote}</Text>
			<Button
				size="lg"
				fullWidth
				iconRight="chevron-right"
				onPress={onFinish}
				testID="setup-invites-cta"
			>
				{C.invitesCta}
			</Button>
			<Text
				style={styles.link}
				onPress={onFinish}
				accessibilityRole="link"
				testID="setup-invites-later"
			>
				{C.invitesLater}
			</Text>
		</View>
	);
};
