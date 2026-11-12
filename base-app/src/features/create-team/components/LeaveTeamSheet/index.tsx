import React from "react";
import { Text } from "react-native";

import { Button, Sheet } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { CREATE_TEAM_COPY as C } from "../../constants";
import { ILeaveConfirm } from "../../hooks/useNewTeam";

interface ILeaveTeamSheetProps {
	leave: ILeaveConfirm;
}

const createLeaveTeamSheetStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;
	return {
		body: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			lineHeight: typography.sizes.ui * 1.45,
			color: colors.textSecondary,
		},
	};
};

// "Você já está na equipe X. Quer sair dela para abrir a nova?"
export const LeaveTeamSheet: React.FC<ILeaveTeamSheetProps> = ({ leave }) => {
	const { theme } = useTheme();
	const styles = createLeaveTeamSheetStyles(theme);

	return (
		<Sheet
			open={leave.isOpen}
			title={C.leaveTitle(leave.current)}
			onClose={leave.close}
			actions={
				<>
					<Button fullWidth icon="log-out" onPress={leave.confirm} testID="create-team-leave">
						{C.leaveConfirm}
					</Button>
					<Button fullWidth variant="ghost" onPress={leave.close} testID="create-team-stay">
						{C.leaveCancel(leave.current)}
					</Button>
				</>
			}
		>
			<Text style={styles.body}>{C.leaveBody(leave.current)}</Text>
		</Sheet>
	);
};
