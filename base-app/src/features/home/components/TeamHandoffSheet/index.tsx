import React from "react";
import { Text } from "react-native";

import { Button, Sheet } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { HANDOFF_COPY as C } from "../../constants";
import { IUseTeamHandoffReturn } from "../../hooks/useTeamHandoff";

interface ITeamHandoffSheetProps {
	handoff: IUseTeamHandoffReturn;
}

const createTeamHandoffSheetStyles = (theme: ITheme) => {
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

// "Você já está na equipe X": ir para a equipe criada no cadastro ou ficar
export const TeamHandoffSheet: React.FC<ITeamHandoffSheetProps> = ({ handoff }) => {
	const { theme } = useTheme();
	const styles = createTeamHandoffSheetStyles(theme);
	const { created, current } = handoff;

	return (
		<Sheet
			open={handoff.isOpen}
			title={C.title(current)}
			onClose={handoff.dismiss}
			actions={
				<>
					<Button
						fullWidth
						icon="users"
						disabled={handoff.isBusy}
						onPress={handoff.move}
						testID="handoff-move"
					>
						{C.move(created)}
					</Button>
					<Button
						fullWidth
						variant="ghost"
						disabled={handoff.isBusy}
						onPress={handoff.stay}
						testID="handoff-stay"
					>
						{C.stay(current)}
					</Button>
				</>
			}
		>
			<Text style={styles.body}>{C.body(created, current)}</Text>
		</Sheet>
	);
};
