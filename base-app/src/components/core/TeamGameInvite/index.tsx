import React from "react";
import { Text, View } from "react-native";

import { Button, Sheet } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { useTeamGameInvite } from "./useTeamGameInvite";

const COPY = {
	title: "Você está na roleta da equipe!",
	called: (name: string) => `${name} chamou a roleta e girou um desafio para você.`,
	yours: "Seu desafio",
	all: "O desafio de cada um",
	accept: "Aceitar e correr",
	watch: "Ver a roleta",
	later: "Agora não",
} as const;

const createInviteStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	const { fonts, sizes } = typography;
	return {
		body: { gap: spacing[3] },
		text: { fontFamily: fonts.medium, fontSize: sizes.sm, color: colors.textSecondary },
		label: { fontFamily: fonts.bold, fontSize: sizes.xs, letterSpacing: 1, color: colors.accent },
		mine: { fontFamily: fonts.extrabold, fontSize: sizes.xl, color: colors.textPrimary },
		row: {
			flexDirection: "row" as const,
			justifyContent: "space-between" as const,
			gap: spacing[3],
		},
		name: { flex: 1, fontFamily: fonts.semibold, fontSize: sizes.sm, color: colors.textPrimary },
		you: { color: colors.accent },
		value: { fontFamily: fonts.medium, fontSize: sizes.sm, color: colors.textSecondary },
	};
};

// Pop-up do convite da roleta, em qualquer tela: o seu desafio (km e pace),
// o de cada participante e "Aceitar e correr", que já abre a corrida
export const TeamGameInvite: React.FC = () => {
	const { theme } = useTheme();
	const invite = useTeamGameInvite();
	const styles = createInviteStyles(theme);

	return (
		<Sheet
			open={invite.isOpen}
			title={COPY.title}
			onClose={invite.close}
			testID="team-game-invite"
			actions={
				<>
					<Button onPress={invite.accept} testID="team-game-invite-accept">
						{COPY.accept}
					</Button>
					<Button variant="glass" onPress={invite.watch} testID="team-game-invite-watch">
						{COPY.watch}
					</Button>
					<Button variant="ghost" onPress={invite.close} testID="team-game-invite-later">
						{COPY.later}
					</Button>
				</>
			}
		>
			<View style={styles.body}>
				<Text style={styles.text}>{COPY.called(invite.starter)}</Text>
				<Text style={styles.label}>{COPY.yours.toUpperCase()}</Text>
				<Text style={styles.mine}>{invite.mine}</Text>
				<Text style={styles.label}>{COPY.all.toUpperCase()}</Text>
				{invite.rows.map((r) => (
					<View key={r.id} style={styles.row}>
						<Text style={[styles.name, r.isYou && styles.you]} numberOfLines={1}>
							{r.name}
						</Text>
						<Text style={styles.value}>{r.challenge}</Text>
					</View>
				))}
			</View>
		</Sheet>
	);
};
