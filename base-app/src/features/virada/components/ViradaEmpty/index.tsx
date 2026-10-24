import React from "react";
import { Text } from "react-native";

import { Button, GlassCard } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { VIRADA_COPY } from "../../constants";

interface IViradaEmptyProps {
	hasTeam: boolean;
	onTeam: () => void;
	onRanking: () => void;
}

const createViradaEmptyStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		card: { gap: spacing[3] },
		title: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.lg,
			color: colors.textPrimary,
		},
		body: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			lineHeight: typography.sizes.sm * 1.5,
			color: colors.textSecondary,
		},
	};
};

// Sem disputa ainda: sem equipe (vai para Equipe) ou sem rival na cidade (Ranking).
export const ViradaEmpty: React.FC<IViradaEmptyProps> = ({ hasTeam, onTeam, onRanking }) => {
	const { theme } = useTheme();
	const styles = createViradaEmptyStyles(theme);

	return (
		<GlassCard style={styles.card}>
			<Text style={styles.title}>
				{hasTeam ? VIRADA_COPY.emptyNoRivalTitle : VIRADA_COPY.emptyNoTeamTitle}
			</Text>
			<Text style={styles.body}>
				{hasTeam ? VIRADA_COPY.emptyNoRivalBody : VIRADA_COPY.emptyNoTeamBody}
			</Text>
			<Button
				size="md"
				fullWidth
				onPress={hasTeam ? onRanking : onTeam}
				testID="virada-empty-action"
			>
				{hasTeam ? VIRADA_COPY.emptyNoRivalAction : VIRADA_COPY.emptyNoTeamAction}
			</Button>
		</GlassCard>
	);
};
