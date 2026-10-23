import React from "react";
import { Text, View } from "react-native";

import { GlassCard, Icon, ProgressBar } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { IChallenge } from "../../constants";

interface IChallengeCardProps {
	challenge: IChallenge;
}

const DOT = 42;

const createChallengeCardStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;
	const meta = {
		fontFamily: typography.fonts.medium,
		fontSize: typography.sizes.xs,
		color: colors.textTertiary,
	};
	return {
		header: {
			flexDirection: "row" as const,
			gap: 12,
			alignItems: "center" as const,
			marginBottom: 14,
		},
		dot: {
			width: DOT,
			height: DOT,
			borderRadius: DOT / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: colors.accentSoft,
		},
		body: { flex: 1 },
		title: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.ui,
			lineHeight: typography.sizes.ui * 1.25,
			color: colors.textPrimary,
		},
		metaRow: {
			flexDirection: "row" as const,
			gap: 10,
			marginTop: 4,
			alignItems: "center" as const,
		},
		meta,
		reward: { flexDirection: "row" as const, gap: 4, alignItems: "center" as const },
	};
};

// Desafio com prazo, recompensa e barra de progresso.
export const ChallengeCard: React.FC<IChallengeCardProps> = ({ challenge }) => {
	const { theme } = useTheme();
	const styles = createChallengeCardStyles(theme);

	return (
		<GlassCard>
			<View style={styles.header}>
				<View style={styles.dot}>
					<Icon name={challenge.icon} size={19} color={theme.pace.colors.orange[400]} />
				</View>
				<View style={styles.body}>
					<Text style={styles.title}>{challenge.title}</Text>
					<View style={styles.metaRow}>
						<Text style={styles.meta}>{challenge.due}</Text>
						<Text style={styles.meta}>·</Text>
						<View style={styles.reward}>
							<Icon name="gift" size={12} color={theme.pace.colors.textTertiary} />
							<Text style={styles.meta}>{challenge.reward}</Text>
						</View>
					</View>
				</View>
			</View>
			<ProgressBar value={challenge.value} max={challenge.max} valueLabel={challenge.valueLabel} />
		</GlassCard>
	);
};
