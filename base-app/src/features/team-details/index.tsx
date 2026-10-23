import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import {
	Avatar,
	Badge,
	GlassCard,
	ListRow,
	ProgressBar,
	ScreenBackground,
	ScreenScroll,
	SectionHeader,
	StatTile,
	TopBar,
} from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { formatKm, formatPoints, PHOTOS } from "@/lib/pace";

import { AchievementTile } from "./components/AchievementTile";
import { WeeklyCard } from "./components/WeeklyCard";
import { ACHIEVEMENTS, TEAM_DETAILS_COPY, WEEKLY_KM_PER_MEMBER } from "./constants";
import { useTeamDetails } from "./hooks/useTeamDetails";

const createTeamDetailsStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { flex: 1 },
		loading: { paddingVertical: 40 },
		identity: { flexDirection: "row" as const, alignItems: "center" as const, gap: 14 },
		identityText: { flex: 1 },
		logo: { boxShadow: `0 0 0 2px ${colors.orange[500]}, 0 12px 30px -8px rgba(253,90,12,.6)` },
		name: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 24,
			lineHeight: 24 * 1.1,
			color: colors.textPrimary,
		},
		badges: { flexDirection: "row" as const, gap: 6, marginTop: spacing[2] },
		about: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			lineHeight: typography.sizes.ui * 1.5,
			color: colors.textSecondary,
		},
		row: { flexDirection: "row" as const, gap: spacing[2] },
		cell: { flex: 1 },
		members: { gap: spacing[2] },
	};
};

// 12 Detalhes da equipe: identidade, números, semana, conquistas e funções.
export const TeamDetailsScreen: React.FC = () => {
	const { theme } = useTheme();
	const { team, isLoading, goBack, openInvite } = useTeamDetails();
	const styles = createTeamDetailsStyles(theme);
	const goal = (team?.size ?? 0) * WEEKLY_KM_PER_MEMBER;

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.citySkylineDusk} />
			<ScreenScroll>
				<TopBar
					title={TEAM_DETAILS_COPY.title}
					onBack={goBack}
					right={{ icon: "share-2", label: TEAM_DETAILS_COPY.share }}
				/>
				{isLoading ? (
					<ActivityIndicator style={styles.loading} color={theme.pace.colors.textPrimary} />
				) : null}
				{team ? (
					<View style={styles.identity}>
						<Avatar name={team.name} square size={64} style={styles.logo} />
						<View style={styles.identityText}>
							<Text style={styles.name}>{team.name}</Text>
							<View style={styles.badges}>
								<Badge tone="accent">{team.category}</Badge>
								<Badge>{team.since}</Badge>
							</View>
						</View>
					</View>
				) : null}
				{team ? <Text style={styles.about}>{team.description || team.place}</Text> : null}
				{team ? (
					<View style={styles.row}>
						<GlassCard padding={14} radius={22} style={styles.cell}>
							<StatTile
								size="sm"
								icon="trophy"
								label={TEAM_DETAILS_COPY.rank}
								value={`${String(team.position)}º`}
								sub={`${formatPoints(team.points)} pts na semana`}
								accent
							/>
						</GlassCard>
						<GlassCard padding={14} radius={22} style={styles.cell}>
							<StatTile
								size="sm"
								icon="route"
								label={TEAM_DETAILS_COPY.totalKm}
								value={formatKm(team.totalKm, 0)}
								sub={TEAM_DETAILS_COPY.season}
							/>
						</GlassCard>
					</View>
				) : null}
				{team ? <WeeklyCard days={team.weekDays} /> : null}
				<SectionHeader title={TEAM_DETAILS_COPY.achievements} />
				<View style={styles.row}>
					{ACHIEVEMENTS.map((a) => (
						<AchievementTile key={a.label} icon={a.icon} label={a.label} />
					))}
				</View>
				<SectionHeader
					title={TEAM_DETAILS_COPY.members}
					action={team?.isMine ? TEAM_DETAILS_COPY.manage : undefined}
					onAction={openInvite}
				/>
				<View style={styles.members}>
					{(team?.members ?? []).map((m) => (
						<ListRow
							key={m.id ?? m.name}
							title={m.name}
							sub={`${m.role} · ${formatKm(m.km, 1)}${TEAM_DETAILS_COPY.weekKm}`}
							right={
								m.role === "Capitão" ? (
									<Badge tone="solid">{TEAM_DETAILS_COPY.captain}</Badge>
								) : null
							}
						/>
					))}
				</View>
				<SectionHeader title={TEAM_DETAILS_COPY.challenges} />
				<GlassCard variant="accent">
					<ProgressBar
						value={team?.km ?? 0}
						max={goal || 1}
						label={`${String(goal)}${TEAM_DETAILS_COPY.challengeLabel}`}
						valueLabel={`${formatKm(team?.km ?? 0, 0)} / ${String(goal)}`}
					/>
				</GlassCard>
			</ScreenScroll>
		</View>
	);
};
