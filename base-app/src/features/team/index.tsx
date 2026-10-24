import React from "react";
import { ActivityIndicator, View } from "react-native";

import {
	Button,
	FloatingToast,
	ScreenBackground,
	ScreenScroll,
	SectionHeader,
} from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { MemberRow } from "./components/MemberRow";
import { TeamEmpty } from "./components/TeamEmpty";
import { TeamHero } from "./components/TeamHero";
import { TeamPodium } from "./components/TeamPodium";
import { TeamSheets } from "./components/TeamSheets";
import { TeamStats } from "./components/TeamStats";
import { TEAM_COPY } from "./constants";
import { useTeamScreen } from "./hooks/useTeamScreen";

const createTeamStyles = (theme: ITheme) => ({
	root: { flex: 1 },
	loading: { flex: 1, alignItems: "center" as const, justifyContent: "center" as const },
	actions: { flexDirection: "row" as const, gap: 10 },
	action: { flex: 1 },
	members: { gap: theme.pace.spacing[2] },
});

// 09a Equipe: capa do time, números da semana, pódio interno e integrantes.
export const TeamScreen: React.FC = () => {
	const { theme } = useTheme();
	const screen = useTeamScreen();
	const styles = createTeamStyles(theme);
	const { team } = screen;

	if (screen.isLoading) {
		return (
			<View style={styles.root}>
				<ScreenBackground photo={PHOTOS.teamRunningSunset} />
				<View style={styles.loading}>
					<ActivityIndicator color={theme.pace.colors.textPrimary} />
				</View>
			</View>
		);
	}

	return (
		<View style={styles.root}>
			{team ? (
				<>
					<ScreenBackground photo={PHOTOS.teamRunningSunset} />
					<ScreenScroll hasRail testID="team-scroll">
						<TeamHero
							name={team.name}
							logoUrl={team.logoUrl}
							place={team.place}
							category={team.category}
							onOpenDetails={screen.openDetails}
						/>
						<TeamStats position={team.position} points={team.points} km={team.km} />
						<View style={styles.actions}>
							<Button
								size="sm"
								icon="user-plus"
								style={styles.action}
								onPress={screen.openInvite}
								testID="team-invite"
							>
								{TEAM_COPY.invite}
							</Button>
							<Button
								size="sm"
								variant="glass"
								icon="trophy"
								style={styles.action}
								onPress={screen.openRanking}
								testID="team-ranking"
							>
								{TEAM_COPY.ranking}
							</Button>
						</View>
						<TeamPodium members={team.members} />
						<SectionHeader
							title={`${TEAM_COPY.membersTitle}${String(team.members.length)}/${String(team.size)}`}
							action={TEAM_COPY.membersAction}
							onAction={screen.openDetails}
						/>
						<View style={styles.members}>
							{team.members.map((m, i) => (
								<MemberRow key={m.id ?? m.name} member={m} position={i} />
							))}
						</View>
						<Button
							fullWidth
							variant="glass"
							icon="repeat"
							onPress={screen.openLeave}
							testID="team-switch"
						>
							{TEAM_COPY.switchTeam}
						</Button>
					</ScreenScroll>
				</>
			) : (
				<TeamEmpty
					invite={screen.invite}
					onAccept={screen.acceptInvite}
					onDecline={screen.declineInvite}
					onCreate={screen.openCreate}
					onJoin={screen.openJoin}
				/>
			)}
			<TeamSheets screen={screen} />
			<FloatingToast toast={screen.toast} />
		</View>
	);
};
