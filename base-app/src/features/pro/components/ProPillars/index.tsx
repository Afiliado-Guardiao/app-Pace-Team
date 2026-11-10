import React from "react";
import { Text, View } from "react-native";

import { GlassCard, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { PRO_PILLARS } from "../../constants";

const DOT = 44;

const createProPillarsStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { gap: spacing[3] },
		card: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[3] },
		dot: {
			width: DOT,
			height: DOT,
			borderRadius: DOT / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: colors.accent,
			boxShadow: theme.pace.shadows.accentSoftGlow,
		},
		body: { flex: 1, gap: 2 },
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.sm,
			letterSpacing: 0.6,
			color: colors.textPrimary,
		},
		text: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			lineHeight: typography.sizes.xs * 1.45,
			color: colors.textSecondary,
		},
		icon: colors.onAccent,
	};
};

// Os 3 pilares do Team Pro: PACE AI, Buddy Studio e Team Analytics
export const ProPillars: React.FC = () => {
	const { theme } = useTheme();
	const styles = createProPillarsStyles(theme);

	return (
		<View style={styles.root}>
			{PRO_PILLARS.map((pillar) => (
				<GlassCard key={pillar.id}>
					<View style={styles.card}>
						<View style={styles.dot}>
							<Icon name={pillar.icon} size={20} color={styles.icon} />
						</View>
						<View style={styles.body}>
							<Text style={styles.title}>{pillar.title}</Text>
							<Text style={styles.text}>{pillar.text}</Text>
						</View>
					</View>
				</GlassCard>
			))}
		</View>
	);
};
