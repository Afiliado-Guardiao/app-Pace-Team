import React from "react";
import { Text, View } from "react-native";

import { Avatar, Button, Sheet } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { TEAM_DETAILS_COPY as C } from "../../constants";
import { IUseCaptainTransferReturn } from "../../hooks/useCaptainTransfer";

interface ICaptainSheetProps {
	captain: IUseCaptainTransferReturn;
}

const createCaptainSheetStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		list: { gap: spacing[2] },
		body: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			lineHeight: typography.sizes.ui * 1.45,
			color: colors.textSecondary,
		},
		who: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[3] },
	};
};

// Passar a capitania: lista de integrantes e depois a confirmação
export const CaptainSheet: React.FC<ICaptainSheetProps> = ({ captain }) => {
	const { theme } = useTheme();
	const styles = createCaptainSheetStyles(theme);
	const { target } = captain;

	return (
		<Sheet
			open={captain.isOpen}
			title={target ? C.captainConfirmTitle(target.name) : C.captainPickTitle}
			onClose={captain.close}
			actions={
				target ? (
					<>
						<Button
							fullWidth
							icon="crown"
							disabled={captain.isBusy}
							onPress={captain.confirm}
							testID="captain-confirm"
						>
							{C.captainConfirm}
						</Button>
						<Button fullWidth variant="ghost" onPress={captain.back} testID="captain-back">
							{C.captainBack}
						</Button>
					</>
				) : (
					<Button fullWidth variant="ghost" onPress={captain.close} testID="captain-cancel">
						{C.cancel}
					</Button>
				)
			}
		>
			{target ? (
				<View style={styles.list}>
					<View style={styles.who}>
						<Avatar name={target.name} src={target.avatarUrl ?? undefined} size={44} />
						<Text style={styles.body}>{target.name}</Text>
					</View>
					<Text style={styles.body}>{C.captainConfirmBody}</Text>
				</View>
			) : (
				<View style={styles.list}>
					<Text style={styles.body}>
						{captain.candidates.length > 0 ? C.captainPickBody : C.captainNone}
					</Text>
					{captain.candidates.map((m) => (
						<Button
							key={m.id ?? m.name}
							fullWidth
							variant="glass"
							icon="user"
							onPress={() => {
								captain.pick(m);
							}}
							testID={`captain-pick-${m.id ?? m.name}`}
						>
							{m.name}
						</Button>
					))}
				</View>
			)}
		</Sheet>
	);
};
