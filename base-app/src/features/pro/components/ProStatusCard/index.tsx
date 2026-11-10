import React from "react";
import { Text, View } from "react-native";

import { Button, GlassCard, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { IProStatusContent } from "../../utils/statusContent";

interface IProStatusCardProps {
	content: IProStatusContent;
	onAction: () => void;
}

const DOT = 40;

const createProStatusCardStyles = (theme: ITheme, isGold: boolean) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		card: { gap: spacing[3] },
		row: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[3] },
		dot: {
			width: DOT,
			height: DOT,
			borderRadius: DOT / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: isGold ? colors.statusWarningSoft : colors.accentSoft,
		},
		title: {
			flex: 1,
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.lg,
			color: colors.textPrimary,
		},
		body: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			lineHeight: typography.sizes.sm * 1.45,
			color: colors.textSecondary,
		},
		icon: isGold ? colors.statusWarning : colors.orange[400],
	};
};

// Situação do atleta no Team Pro: equipe PRO, sem equipe, só o capitão assina…
export const ProStatusCard: React.FC<IProStatusCardProps> = ({ content, onAction }) => {
	const { theme } = useTheme();
	const styles = createProStatusCardStyles(theme, content.isGold);

	return (
		<GlassCard>
			<View style={styles.card}>
				<View style={styles.row}>
					<View style={styles.dot}>
						<Icon name={content.icon} size={20} color={styles.icon} />
					</View>
					<Text style={styles.title}>{content.title}</Text>
				</View>
				<Text style={styles.body}>{content.body}</Text>
				{content.cta ? (
					<Button fullWidth variant="glass" onPress={onAction} testID="pro-status-action">
						{content.cta}
					</Button>
				) : null}
			</View>
		</GlassCard>
	);
};
