import React from "react";
import { Text, View } from "react-native";

import {
	Avatar,
	Button,
	GlassCard,
	Highlight,
	ScreenBackground,
	ScreenScroll,
	tracking,
} from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";
import { IMyInvite } from "@/lib/supabase";

import { TEAM_COPY } from "../../constants";

interface ITeamEmptyProps {
	invite: IMyInvite | null;
	onAccept: () => void;
	onDecline: () => void;
	onCreate: () => void;
	onJoin: () => void;
}

const TITLE = 34;
const BACKDROP_BLUR = 10;

const createTeamEmptyStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;
	return {
		root: { flex: 1 },
		intro: { marginTop: 150 },
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: TITLE,
			lineHeight: TITLE * 1.12,
			letterSpacing: tracking(typography.tracking.tight, TITLE),
			color: colors.textPrimary,
		},
		body: {
			marginTop: 12,
			maxWidth: 310,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			lineHeight: typography.sizes.ui * 1.5,
			color: colors.textSecondary,
		},
		invite: { flexDirection: "row" as const, alignItems: "center" as const, gap: 12 },
		inviteBody: { flex: 1 },
		inviteTitle: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		},
		inviteSub: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.label,
			color: colors.textSecondary,
		},
		actions: { flexDirection: "row" as const, gap: 8, marginTop: 14 },
		action: { flex: 1 },
	};
};

// 09b Equipe · sem time: convite recebido, criar ou entrar numa equipe.
export const TeamEmpty: React.FC<ITeamEmptyProps> = ({
	invite,
	onAccept,
	onDecline,
	onCreate,
	onJoin,
}) => {
	const { theme } = useTheme();
	const styles = createTeamEmptyStyles(theme);

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.teamRunningSunset} blur={BACKDROP_BLUR} />
			<ScreenScroll hasRail>
				<View style={styles.intro}>
					<Text style={styles.title}>
						{TEAM_COPY.emptyTitleA}
						{"\n"}
						{TEAM_COPY.emptyTitleB}
						<Highlight>{TEAM_COPY.emptyHighlight}</Highlight>
					</Text>
					<Text style={styles.body}>{TEAM_COPY.emptyBody}</Text>
				</View>
				{invite ? (
					<GlassCard variant="accent">
						<View style={styles.invite}>
							<Avatar name={invite.teamName} square size={46} />
							<View style={styles.inviteBody}>
								<Text
									style={styles.inviteTitle}
								>{`${invite.teamName}${TEAM_COPY.inviteTitleSuffix}`}</Text>
								<Text
									style={styles.inviteSub}
								>{`${String(invite.size)} x ${String(invite.size)} · ${invite.city} · ${String(invite.size - invite.members)}${TEAM_COPY.inviteSpots}`}</Text>
							</View>
						</View>
						<View style={styles.actions}>
							<Button
								size="sm"
								style={styles.action}
								onPress={onAccept}
								testID="team-accept-invite"
							>
								{TEAM_COPY.accept}
							</Button>
							<Button
								size="sm"
								variant="glass"
								style={styles.action}
								onPress={onDecline}
								testID="team-decline-invite"
							>
								{TEAM_COPY.decline}
							</Button>
						</View>
					</GlassCard>
				) : null}
				<Button size="lg" icon="plus" fullWidth onPress={onCreate} testID="team-create">
					{TEAM_COPY.create}
				</Button>
				<Button
					size="lg"
					variant="glass"
					icon="log-in"
					fullWidth
					onPress={onJoin}
					testID="team-join"
				>
					{TEAM_COPY.join}
				</Button>
			</ScreenScroll>
		</View>
	);
};
