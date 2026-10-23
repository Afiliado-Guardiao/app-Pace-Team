import React from "react";
import { Text, View } from "react-native";

import { CountUp, GlassCard } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

const createProfileTotalsStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;
	return {
		row: { flexDirection: "row" as const },
		cell: { flex: 1, alignItems: "center" as const },
		divider: { borderLeftWidth: 1, borderLeftColor: colors.hairline },
		value: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.h2,
			color: colors.textPrimary,
		},
		label: {
			marginTop: 6,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.label,
			color: colors.textSecondary,
		},
	};
};

// Corridas, km e ritmo médio do atleta (números que contam ao abrir).
interface IProfileTotalsProps {
	totals: readonly { label: string; value: string }[];
}

export const ProfileTotals: React.FC<IProfileTotalsProps> = ({ totals }) => {
	const { theme } = useTheme();
	const styles = createProfileTotalsStyles(theme);

	return (
		<GlassCard padding={18}>
			<View style={styles.row}>
				{totals.map((t, i) => (
					<View key={t.label} style={[styles.cell, i > 0 ? styles.divider : null]}>
						<Text style={styles.value}>
							<CountUp value={t.value} delay={200 + i * 100} />
						</Text>
						<Text style={styles.label}>{t.label}</Text>
					</View>
				))}
			</View>
		</GlassCard>
	);
};
