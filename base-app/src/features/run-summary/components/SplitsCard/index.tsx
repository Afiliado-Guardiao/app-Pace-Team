import React from "react";
import { Text, View } from "react-native";

import { GlassCard, Label } from "@/components/pace";
import { SpringBar } from "@/components/shared/SpringBar";
import { ITheme, useTheme } from "@/theme";

import { RUN_SUMMARY_COPY } from "../../constants";
import { ISplit } from "../../hooks/useRunSummary";

interface ISplitsCardProps {
	splits: readonly ISplit[];
}

const BAR = 8;
const STAGGER = 80;

const createSplitsCardStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		title: { marginBottom: spacing[3] },
		row: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: 10,
			paddingVertical: 6,
		},
		km: {
			width: 34,
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.label,
			color: colors.textTertiary,
		},
		bar: { flex: 1 },
		pace: {
			width: 44,
			textAlign: "right" as const,
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
	};
};

// Parciais por km com barras que enchem em sequência.
export const SplitsCard: React.FC<ISplitsCardProps> = ({ splits }) => {
	const { theme } = useTheme();
	const styles = createSplitsCardStyles(theme);

	return (
		<GlassCard>
			<Label style={styles.title}>{RUN_SUMMARY_COPY.splits}</Label>
			{splits.map((split, i) => (
				<View key={`km-${String(i)}`} style={styles.row}>
					<Text style={styles.km}>{`km ${String(i + 1)}`}</Text>
					<View style={styles.bar}>
						<SpringBar
							progress={split.width / 100}
							height={BAR}
							delay={i * STAGGER}
							trackColor={theme.pace.colors.barTrack}
						/>
					</View>
					<Text style={styles.pace}>{split.pace}</Text>
				</View>
			))}
		</GlassCard>
	);
};
