import React from "react";
import { Pressable, Text, View } from "react-native";

import { Button, GlassCard, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { ANALYTICS_COPY as C, ANALYTICS_PREVIEW } from "../../constants";

interface IAnalyticsPreviewProps {
	onAsk: () => void;
}

const ICON_BOX = 40;

const createAnalyticsPreviewStyles = (theme: ITheme) => {
	const { colors, spacing, typography, radii } = theme.pace;
	return {
		root: { gap: spacing[3] },
		head: { gap: spacing[1] },
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.lg,
			color: colors.textPrimary,
		},
		text: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			lineHeight: typography.sizes.sm * 1.45,
			color: colors.textSecondary,
		},
		row: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[3] },
		iconBox: {
			width: ICON_BOX,
			height: ICON_BOX,
			borderRadius: radii.md,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: colors.glass2,
		},
		body: { flex: 1, gap: 2 },
		cardTitle: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		},
		cardText: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			lineHeight: typography.sizes.xs * 1.45,
			color: colors.textSecondary,
		},
		lock: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: 4,
			paddingHorizontal: spacing[2],
			paddingVertical: 2,
			borderRadius: radii.pill,
			backgroundColor: colors.accentSoft,
		},
		lockText: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.micro,
			color: colors.textPrimary,
		},
		accent: colors.orange[400],
	};
};

// Sem o Team Pro: cada relatório que existe, com cadeado. Tocar em qualquer
// um (ou no botão) abre a janela do Team Pro. Nenhum número inventado.
export const AnalyticsPreview: React.FC<IAnalyticsPreviewProps> = ({ onAsk }) => {
	const { theme } = useTheme();
	const styles = createAnalyticsPreviewStyles(theme);

	return (
		<View style={styles.root}>
			<View style={styles.head}>
				<Text style={styles.title}>{C.previewTitle}</Text>
				<Text style={styles.text}>{C.previewBody}</Text>
			</View>
			{ANALYTICS_PREVIEW.map((item) => (
				<Pressable
					key={item.title}
					onPress={onAsk}
					accessibilityRole="button"
					accessibilityLabel={item.title}
					testID={`analytics-preview-${item.icon}`}
				>
					<GlassCard>
						<View style={styles.row}>
							<View style={styles.iconBox}>
								<Icon name={item.icon} size={20} color={styles.accent} />
							</View>
							<View style={styles.body}>
								<Text style={styles.cardTitle}>{item.title}</Text>
								<Text style={styles.cardText}>{item.text}</Text>
							</View>
							<View style={styles.lock}>
								<Icon name="lock" size={11} color={styles.accent} />
								<Text style={styles.lockText}>{C.previewLock}</Text>
							</View>
						</View>
					</GlassCard>
				</Pressable>
			))}
			<Button size="lg" fullWidth icon="crown" onPress={onAsk} testID="analytics-open-pro">
				{C.previewCta}
			</Button>
		</View>
	);
};
