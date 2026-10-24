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

import { DeleteAccountSheet } from "./components/DeleteAccountSheet";
import { EditProfileSheet } from "./components/EditProfileSheet";
import { LegalLinks } from "./components/LegalLinks";
import { MedalsRow } from "./components/MedalsRow";
import { PrivacyList } from "./components/PrivacyList";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileTotals } from "./components/ProfileTotals";
import { StatsCard } from "./components/StatsCard";
import { NO_RUNS, PROFILE_COPY } from "./constants";
import { useDeleteAccount } from "./hooks/useDeleteAccount";
import { useEditProfile } from "./hooks/useEditProfile";
import { usePrivacy } from "./hooks/usePrivacy";
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
	const edit = useEditProfile(profile.showToast);
	const privacy = usePrivacy(profile.showToast);
	const removal = useDeleteAccount(profile.showToast);
	const askDelete = (): void => {
		removal.openConfirm(profile.closeSettings);
	};
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
						onPress={privacy.open}
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
					avatarUrl={profile.avatarUrl}
					handle={profile.handle}
					city={profile.city}
					team={profile.team}
					role={profile.role}
					onEdit={edit.open}
				/>
				<ProfileTotals totals={profile.totals} />
				<StatsCard period={profile.period} values={profile.bars} onChange={profile.setPeriod} />
				<SectionHeader
					title={PROFILE_COPY.medals}
					action={PROFILE_COPY.seeAll}
					onAction={profile.openChallenges}
				/>
				<MedalsRow medals={profile.medals} />
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
				open={privacy.isOpen}
				title={PROFILE_COPY.privacy}
				onClose={privacy.close}
				actions={
					<Button
						fullWidth
						disabled={privacy.isSaving}
						onPress={privacy.save}
						testID="profile-privacy-save"
					>
						{PROFILE_COPY.save}
					</Button>
				}
			>
				<PrivacyList values={privacy.values} onToggle={privacy.toggle} />
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
						<Button
							fullWidth
							variant="outline"
							icon="trash-2"
							onPress={askDelete}
							testID="profile-delete-account"
						>
							{PROFILE_COPY.deleteAccount}
						</Button>
						<Button fullWidth variant="ghost" onPress={profile.closeSettings}>
							{PROFILE_COPY.close}
						</Button>
					</>
				}
			>
				<Text style={styles.settingsText}>{PROFILE_COPY.settingsBody}</Text>
				<LegalLinks />
			</Sheet>
			<EditProfileSheet edit={edit} />
			<DeleteAccountSheet
				open={removal.isConfirmOpen}
				isDeleting={removal.isDeleting}
				onConfirm={removal.confirm}
				onClose={removal.closeConfirm}
			/>
			<FloatingToast toast={profile.toast} />
		</View>
	);
};
