import React from "react";
import { Text, View } from "react-native";

import { Badge, GlassCard, Icon, Label } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { RUN_SUMMARY_COPY } from "../../constants";

interface IPointsCardProps {
	points: number;
	status: "valid" | "pending" | "invalid";
}

const createPointsCardStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		row: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			justifyContent: "space-between" as const,
		},
		value: {
			marginTop: spacing[2],
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.display,
			lineHeight: typography.sizes.display,
			fontVariant: [...typography.tabularNums],
			color: colors.orange[400],
		},
		unit: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
		},
		note: { flexDirection: "row" as const, gap: 10, marginTop: spacing[3.5] },
		noteIcon: { marginTop: 1 },
		noteText: {
			flex: 1,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.label,
			lineHeight: typography.sizes.label * 1.45,
			color: colors.ink[200],
		},
	};
};

const STATUS_COPY = {
	valid: {
		label: RUN_SUMMARY_COPY.pointsConfirmed,
		tone: "success",
		badge: RUN_SUMMARY_COPY.validated,
		note: RUN_SUMMARY_COPY.noteValid,
	},
	pending: {
		label: RUN_SUMMARY_COPY.pointsPending,
		tone: "warning",
		badge: RUN_SUMMARY_COPY.reviewing,
		note: RUN_SUMMARY_COPY.notePending,
	},
	invalid: {
		label: RUN_SUMMARY_COPY.pointsPending,
		tone: "danger",
		badge: RUN_SUMMARY_COPY.invalid,
		note: RUN_SUMMARY_COPY.noteInvalid,
	},
} as const;

// Pontos provisórios (em análise), confirmados ou corrida não validada.
export const PointsCard: React.FC<IPointsCardProps> = ({ points, status }) => {
	const { theme } = useTheme();
	const styles = createPointsCardStyles(theme);
	const copy = STATUS_COPY[status];

	return (
		<GlassCard variant="accent">
			<View style={styles.row}>
				<View>
					<Label>{copy.label}</Label>
					<Text style={styles.value}>
						{`+${String(points)}`}
						<Text style={styles.unit}> pts</Text>
					</Text>
				</View>
				<Badge tone={copy.tone} dot>
					{copy.badge}
				</Badge>
			</View>
			<View style={styles.note}>
				<Icon
					name="shield-check"
					size={16}
					color={theme.pace.colors.orange[400]}
					style={styles.noteIcon}
				/>
				<Text style={styles.noteText}>{copy.note}</Text>
			</View>
		</GlassCard>
	);
};
