import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import {
	Avatar,
	GlassCard,
	Icon,
	InfoNote,
	ScreenBackground,
	ScreenScroll,
	StatTile,
	TopBar,
} from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { ATHLETE_COPY } from "./constants";
import { useAthleteScreen } from "./hooks/useAthleteScreen";

const createAthleteStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { flex: 1 },
		loading: { paddingVertical: 40 },
		identity: { alignItems: "center" as const, gap: 10 },
		name: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 24,
			color: colors.textPrimary,
		},
		sub: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
		},
		team: { flexDirection: "row" as const, alignItems: "center" as const, gap: 12 },
		teamBody: { flex: 1, minWidth: 0 },
		teamName: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.md,
			color: colors.textPrimary,
		},
		teamSub: {
			marginTop: 2,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.label,
			color: colors.orange[400],
		},
		row: { flexDirection: "row" as const, gap: spacing[2] },
		cell: { flex: 1 },
	};
};

// Perfil de outro atleta: foto, de onde é, equipe (com a posição) e números.
export const AthleteScreen: React.FC = () => {
	const { theme } = useTheme();
	const screen = useAthleteScreen();
	const { athlete, stats } = screen;
	const styles = createAthleteStyles(theme);
	const team = athlete?.team ?? null;

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.runnerCitySunset} />
			<ScreenScroll>
				<TopBar title={ATHLETE_COPY.title} onBack={screen.goBack} />
				{screen.isLoading ? (
					<ActivityIndicator style={styles.loading} color={theme.pace.colors.textPrimary} />
				) : null}
				{athlete ? (
					<View style={styles.identity}>
						<Avatar name={athlete.name} src={athlete.avatarUrl ?? undefined} size={92} ring />
						<Text style={styles.name}>{athlete.name}</Text>
						{screen.sub ? <Text style={styles.sub}>{screen.sub}</Text> : null}
					</View>
				) : null}
				{team ? (
					<Pressable
						onPress={screen.openTeam}
						accessibilityRole="button"
						accessibilityLabel={team.name}
						testID="athlete-team"
					>
						<GlassCard padding={14} radius={22}>
							<View style={styles.team}>
								<Avatar name={team.name} src={team.logoUrl ?? undefined} size={52} square />
								<View style={styles.teamBody}>
									<Text style={styles.teamName} numberOfLines={1}>
										{team.name}
									</Text>
									<Text style={styles.teamSub}>
										{`#${String(team.position)}${ATHLETE_COPY.position} · ${String(team.size)} x ${String(team.size)} · ${team.city}`}
									</Text>
								</View>
								<Icon name="chevron-right" size={18} color={theme.pace.colors.textSecondary} />
							</View>
						</GlassCard>
					</Pressable>
				) : null}
				{stats ? (
					<>
						<View style={styles.row}>
							<GlassCard padding={14} radius={22} style={styles.cell}>
								<StatTile
									size="sm"
									icon="footprints"
									label={ATHLETE_COPY.runs}
									value={stats.runs}
								/>
							</GlassCard>
							<GlassCard padding={14} radius={22} style={styles.cell}>
								<StatTile
									size="sm"
									icon="route"
									label={ATHLETE_COPY.totalKm}
									value={stats.totalKm}
								/>
							</GlassCard>
						</View>
						<View style={styles.row}>
							<GlassCard padding={14} radius={22} style={styles.cell}>
								<StatTile
									size="sm"
									icon="calendar"
									label={ATHLETE_COPY.weekKm}
									value={stats.weekKm}
								/>
							</GlassCard>
							<GlassCard padding={14} radius={22} style={styles.cell}>
								<StatTile
									size="sm"
									icon="zap"
									label={ATHLETE_COPY.weekPoints}
									value={stats.weekPoints}
									accent
								/>
							</GlassCard>
						</View>
					</>
				) : null}
				{athlete?.isPrivate ? <InfoNote icon="lock">{ATHLETE_COPY.private}</InfoNote> : null}
			</ScreenScroll>
		</View>
	);
};
