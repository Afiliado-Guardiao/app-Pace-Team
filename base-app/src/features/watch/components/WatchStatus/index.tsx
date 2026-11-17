import React from "react";
import { Text, View } from "react-native";

import { Badge, GlassCard } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { WATCH_COPY } from "../../constants";

interface IWatchStatusProps {
	since: string;
	lastSync: string | null;
	importedCount: number;
}

const createWatchStatusStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { gap: spacing[3] },
		row: {
			flexDirection: "row" as const,
			justifyContent: "space-between" as const,
			alignItems: "center" as const,
			gap: spacing[2],
		},
		label: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
		},
		value: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
	};
};

// Relógio conectado: desde quando, última busca e quantas corridas vieram.
export const WatchStatus: React.FC<IWatchStatusProps> = ({ since, lastSync, importedCount }) => {
	const { theme } = useTheme();
	const styles = createWatchStatusStyles(theme);

	return (
		<GlassCard testID="watch-status">
			<View style={styles.root}>
				<View style={styles.row}>
					<Badge tone="success" dot>
						{WATCH_COPY.connectedTitle}
					</Badge>
				</View>
				<View style={styles.row}>
					<Text style={styles.label}>{WATCH_COPY.since}</Text>
					<Text style={styles.value}>{since}</Text>
				</View>
				<View style={styles.row}>
					<Text style={styles.label}>{WATCH_COPY.lastSync}</Text>
					<Text style={styles.value}>{lastSync ?? WATCH_COPY.never}</Text>
				</View>
				<View style={styles.row}>
					<Text style={styles.label}>{WATCH_COPY.imported}</Text>
					<Text style={styles.value}>{String(importedCount)}</Text>
				</View>
			</View>
		</GlassCard>
	);
};
