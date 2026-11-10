import React from "react";
import { Text, View } from "react-native";

import { GlassCard, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { ANALYTICS_COPY as C } from "../../constants";
import { IInsight } from "../../utils/analyticsView";

interface IInsightsCardProps {
	insights: readonly IInsight[];
}

const DOT = 30;

const createInsightsCardStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { gap: spacing[3] },
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		},
		row: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[3] },
		dot: {
			width: DOT,
			height: DOT,
			borderRadius: DOT / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
		},
		text: {
			flex: 1,
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			lineHeight: typography.sizes.sm * 1.4,
			color: colors.textPrimary,
		},
		tones: {
			accent: { bg: colors.accentSoft, fg: colors.orange[400] },
			good: { bg: colors.statusSuccessSoft, fg: colors.statusSuccess },
			bad: { bg: colors.statusDangerSoft, fg: colors.statusDanger },
		},
	};
};

// Os números da semana em frases curtas, para ninguém precisar ler gráfico
export const InsightsCard: React.FC<IInsightsCardProps> = ({ insights }) => {
	const { theme } = useTheme();
	const styles = createInsightsCardStyles(theme);

	return (
		<GlassCard>
			<View style={styles.root}>
				<Text style={styles.title}>{C.insightsTitle}</Text>
				{insights.map((item) => (
					<View key={item.text} style={styles.row}>
						<View style={[styles.dot, { backgroundColor: styles.tones[item.tone].bg }]}>
							<Icon name={item.icon} size={16} color={styles.tones[item.tone].fg} />
						</View>
						<Text style={styles.text}>{item.text}</Text>
					</View>
				))}
			</View>
		</GlassCard>
	);
};
