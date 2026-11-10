import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { Button, GlassCard, ScreenBackground, ScreenScroll, TopBar } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { AnalyticsHero } from "./components/AnalyticsHero";
import { InsightsCard } from "./components/InsightsCard";
import { MembersCard } from "./components/MembersCard";
import { RankCard } from "./components/RankCard";
import { RivalCard } from "./components/RivalCard";
import { WeeksChart } from "./components/WeeksChart";
import { ANALYTICS_COPY as C } from "./constants";
import { useTeamAnalyticsScreen } from "./hooks/useTeamAnalyticsScreen";

const createTeamAnalyticsStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { flex: 1 },
		content: { gap: spacing[4], paddingTop: spacing[2] },
		box: { gap: spacing[3] },
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.lg,
			color: colors.textPrimary,
		},
		text: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			lineHeight: typography.sizes.sm * 1.45,
			color: colors.textSecondary,
		},
		fair: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
			textAlign: "center" as const,
		},
		spinner: colors.orange[400],
	};
};

// PACE TEAM ANALYTICS: a semana da equipe em números e frases simples
export const TeamAnalyticsScreen: React.FC = () => {
	const { theme } = useTheme();
	const screen = useTeamAnalyticsScreen();
	const styles = createTeamAnalyticsStyles(theme);
	const { data, view } = screen;

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.teamRunningSunset} />
			<ScreenScroll contentStyle={styles.content}>
				<TopBar title={C.title} onBack={screen.goBack} />
				{screen.isLoading ? <ActivityIndicator color={styles.spinner} /> : null}
				{screen.isLocked ? (
					<GlassCard>
						<View style={styles.box}>
							<Text style={styles.title}>{C.lockedTitle}</Text>
							<Text style={styles.text}>{C.lockedBody}</Text>
							<Button fullWidth icon="crown" onPress={screen.openPro} testID="analytics-open-pro">
								{C.lockedCta}
							</Button>
						</View>
					</GlassCard>
				) : null}
				{screen.isError ? (
					<GlassCard>
						<View style={styles.box}>
							<Text style={styles.title}>{C.errorTitle}</Text>
							<Text style={styles.text}>{C.errorBody}</Text>
							<Button fullWidth variant="glass" onPress={screen.retry} testID="analytics-retry">
								{C.retry}
							</Button>
						</View>
					</GlassCard>
				) : null}
				{data && view && !screen.isLocked ? (
					<>
						<AnalyticsHero view={view} teamName={data.team.name} />
						<InsightsCard insights={view.insights} />
						<WeeksChart view={view} />
						<RivalCard rival={data.rival} teamName={data.team.name} teamKm={screen.teamKm} />
						<RankCard view={view} />
						<MembersCard rows={view.rows} />
						<Text style={styles.fair}>{C.fair}</Text>
					</>
				) : null}
			</ScreenScroll>
		</View>
	);
};
