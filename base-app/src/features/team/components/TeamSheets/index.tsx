import React from "react";
import { Text, View } from "react-native";

import { Button, Input, Sheet } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { TEAM_COPY } from "../../constants";
import { IUseTeamScreen } from "../../hooks/useTeamScreen";

interface ITeamSheetsProps {
	screen: IUseTeamScreen;
}

const createTeamSheetsStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;
	return {
		body: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			lineHeight: typography.sizes.ui * 1.45,
			color: colors.textSecondary,
		},
		join: { gap: 14 },
	};
};

// Folhas da aba Equipe: confirmar saída e entrar pelo código.
export const TeamSheets: React.FC<ITeamSheetsProps> = ({ screen }) => {
	const { theme } = useTheme();
	const styles = createTeamSheetsStyles(theme);

	return (
		<>
			<Sheet
				open={screen.isLeaveOpen}
				title={TEAM_COPY.leaveTitle}
				onClose={screen.closeLeave}
				actions={
					<>
						<Button
							fullWidth
							variant="glass"
							icon="log-out"
							onPress={screen.confirmLeave}
							testID="team-leave-confirm"
						>
							{TEAM_COPY.leaveConfirm}
						</Button>
						<Button fullWidth variant="ghost" onPress={screen.closeLeave}>
							{TEAM_COPY.keep}
						</Button>
					</>
				}
			>
				<Text style={styles.body}>{TEAM_COPY.leaveBody}</Text>
			</Sheet>
			<Sheet
				open={screen.isJoinOpen}
				title={TEAM_COPY.joinTitle}
				onClose={screen.closeJoin}
				actions={
					<>
						<Button
							fullWidth
							disabled={screen.isBusy}
							onPress={screen.confirmJoin}
							testID="team-join-confirm"
						>
							{TEAM_COPY.joinConfirm}
						</Button>
						<Button fullWidth variant="ghost" onPress={screen.closeJoin}>
							{TEAM_COPY.cancel}
						</Button>
					</>
				}
			>
				<View style={styles.join}>
					<Text style={styles.body}>{TEAM_COPY.joinBody}</Text>
					<Input
						label={TEAM_COPY.joinCode}
						icon="key-round"
						value={screen.joinCode}
						onChangeText={screen.setJoinCode}
						placeholder="EX.: 8F3K2Q1A"
						testID="team-join-code"
					/>
				</View>
			</Sheet>
		</>
	);
};
