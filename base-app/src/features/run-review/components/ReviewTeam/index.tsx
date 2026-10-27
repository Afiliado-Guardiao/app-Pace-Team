import React from "react";
import { Text, View } from "react-native";

import { Avatar, Badge } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { ITeamRunMember } from "@/lib/data";
import { formatKm } from "@/lib/pace";

import { RUN_REVIEW_COPY } from "../../constants";

interface IReviewTeamProps {
	// Maior distância primeiro (o primeiro é o melhor desempenho)
	members: readonly ITeamRunMember[];
}

const createReviewTeamStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;
	return {
		root: { gap: 8 },
		title: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
		},
		row: { flexDirection: "row" as const, alignItems: "center" as const, gap: 10 },
		body: { flex: 1, minWidth: 0 },
		name: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		},
		sub: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
		},
		km: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.ui,
			color: colors.orange[400],
		},
	};
};

// Quem correu junto: distância e ritmo de cada um, com o melhor em destaque
export const ReviewTeam: React.FC<IReviewTeamProps> = ({ members }) => {
	const { theme } = useTheme();
	const styles = createReviewTeamStyles(theme);

	return (
		<View style={styles.root}>
			<Text style={styles.title}>{RUN_REVIEW_COPY.team}</Text>
			{members.map((m, i) => (
				<View key={`${m.name}-${String(i)}`} style={styles.row}>
					<Avatar name={m.name} src={m.avatarUrl ?? undefined} size={32} ring={i === 0} />
					<View style={styles.body}>
						<Text style={styles.name} numberOfLines={1}>
							{m.isYou ? RUN_REVIEW_COPY.you : m.name}
						</Text>
						<Text style={styles.sub}>{`${m.pace} /km · ${String(m.points)} pts`}</Text>
					</View>
					{i === 0 ? (
						<Badge tone="accent" dot>
							{RUN_REVIEW_COPY.best}
						</Badge>
					) : null}
					<Text style={styles.km}>{`${formatKm(m.km)} km`}</Text>
				</View>
			))}
		</View>
	);
};
