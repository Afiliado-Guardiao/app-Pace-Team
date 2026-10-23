import React from "react";
import { Text, View } from "react-native";

import {
	Button,
	FloatingToast,
	IconButton,
	InfoNote,
	ScreenBackground,
	ScreenScroll,
	SectionHeader,
	Sheet,
} from "@/components/pace";
import { RunRow } from "@/components/shared/RunRow";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { MedalsRow } from "./components/MedalsRow";
import { PrivacyList } from "./components/PrivacyList";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileTotals } from "./components/ProfileTotals";
import { StatsCard } from "./components/StatsCard";
import { NO_RUNS, PROFILE_COPY } from "./constants";
import { useProfile } from "./hooks/useProfile";

const createProfileStyles = (theme: ITheme) => ({
	root: { flex: 1 },
	actions: { flexDirection: "row" as const, justifyContent: "flex-end" as const, gap: 8 },
	runs: { gap: theme.pace.spacing[2] },
	settingsText: {
		fontFamily: theme.pace.typography.fonts.medium,
		fontSize: theme.pace.typography.sizes.ui,
		lineHeight: theme.pace.typography.sizes.ui * 1.45,
		color: theme.pace.colors.textSecondary,
	},
});

// 13 Perfil: atleta, totais, estatísticas, medalhas e atividades recentes.
export const ProfileScreen: React.FC = () => {
	const { theme } = useTheme();
	const profile = useProfile();
	const styles = createProfileStyles(theme);

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.runnerCitySunset} />
			<ScreenScroll hasRail testID="profile-scroll">
				<View style={styles.actions}>
					<IconButton
						icon="sparkles"
						label={PROFILE_COPY.buddy}
						onPress={profile.openBuddy}
						testID="profile-buddy"
					/>
					<IconButton
						icon="shield"
						label={PROFILE_COPY.privacy}
						onPress={profile.openPrivacy}
						testID="profile-privacy"
					/>
					<IconButton
						icon="settings"
						label={PROFILE_COPY.settings}
						onPress={profile.openSettings}
						testID="profile-settings"
					/>
				</View>
				<ProfileHeader
					name={profile.name}
					handle={profile.handle}
					city={profile.city}
					team={profile.team}
					role={profile.role}
					onEdit={profile.editProfile}
				/>
				<ProfileTotals totals={profile.totals} />
				<StatsCard period={profile.period} values={profile.bars} onChange={profile.setPeriod} />
				<SectionHeader
					title={PROFILE_COPY.medals}
					action={PROFILE_COPY.seeAll}
					onAction={profile.openChallenges}
				/>
				<MedalsRow />
				<SectionHeader
					title={PROFILE_COPY.activities}
					action={PROFILE_COPY.history}
					onAction={profile.openHistory}
				/>
				<View style={styles.runs}>
					{profile.recentRuns.length ? null : <InfoNote icon="footprints">{NO_RUNS}</InfoNote>}
					{profile.recentRuns.map((run, i) => (
						<RunRow
							key={run.id}
							run={run}
							seed={i}
							onPress={() => {
								profile.openRun(run.id);
							}}
						/>
					))}
				</View>
			</ScreenScroll>
			<Sheet
				open={profile.isPrivacyOpen}
				title={PROFILE_COPY.privacy}
				onClose={profile.closePrivacy}
				actions={
					<Button fullWidth onPress={profile.closePrivacy}>
						{PROFILE_COPY.save}
					</Button>
				}
			>
				<PrivacyList />
			</Sheet>
			<Sheet
				open={profile.isSettingsOpen}
				title={PROFILE_COPY.settings}
				onClose={profile.closeSettings}
				actions={
					<>
						<Button
							fullWidth
							variant="glass"
							icon="log-out"
							onPress={profile.handleSignOut}
							testID="profile-sign-out"
						>
							{PROFILE_COPY.signOut}
						</Button>
						<Button fullWidth variant="ghost" onPress={profile.closeSettings}>
							{PROFILE_COPY.close}
						</Button>
					</>
				}
			>
				<Text style={styles.settingsText}>{PROFILE_COPY.settingsBody}</Text>
			</Sheet>
			<FloatingToast toast={profile.toast} />
		</View>
	);
};
