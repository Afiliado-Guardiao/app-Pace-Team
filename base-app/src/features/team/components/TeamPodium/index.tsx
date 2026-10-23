import React from "react";
import { Text, View } from "react-native";

import { GlassCard } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { ITeamMember } from "@/lib/pace";

import { PODIUM_METRICS, PODIUM_SLOTS, TEAM_COPY } from "../../constants";
import { useTeamPodium } from "../../hooks/useTeamPodium";
import { MetricToggle } from "../MetricToggle";

import { PodiumColumn } from "./PodiumColumn";

const createTeamPodiumStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;
	return {
		header: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			justifyContent: "space-between" as const,
			gap: 10,
		},
		titleBlock: { flex: 1, minWidth: 0 },
		title: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.md,
			color: colors.textPrimary,
		},
		sub: {
			marginTop: 3,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.label,
			color: colors.textTertiary,
		},
		columns: {
			flexDirection: "row" as const,
			alignItems: "flex-end" as const,
			gap: 8,
			marginTop: 18,
		},
		missing: {
			marginTop: 12,
			textAlign: "center" as const,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.label,
			lineHeight: typography.sizes.label * 1.35,
			color: colors.textSecondary,
		},
		missingStrong: { fontFamily: typography.fonts.bold, color: colors.textPrimary },
	};
};

// Pódio semanal dentro da equipe: ouro, prata e bronze por pontos ou km.
interface ITeamPodiumProps {
	members: readonly ITeamMember[];
}

export const TeamPodium: React.FC<ITeamPodiumProps> = ({ members }) => {
	const { theme } = useTheme();
	const podium = useTeamPodium(members);
	const styles = createTeamPodiumStyles(theme);

	return (
		<GlassCard padding={18}>
			<View style={styles.header}>
				<View style={styles.titleBlock}>
					<Text style={styles.title}>{TEAM_COPY.podiumTitle}</Text>
					<Text style={styles.sub}>{TEAM_COPY.podiumSub}</Text>
				</View>
				<MetricToggle options={PODIUM_METRICS} value={podium.metric} onChange={podium.setMetric} />
			</View>
			<View style={styles.columns}>
				{PODIUM_SLOTS.map((place) => {
					const member = podium.top.at(place);
					return member ? (
						<PodiumColumn
							key={place}
							member={member}
							place={place}
							value={podium.valueOf(member)}
							metricKey={podium.metric}
						/>
					) : null;
				})}
			</View>
			{podium.missing ? (
				<Text style={styles.missing}>
					{`${TEAM_COPY.missingA}${String(podium.missing.place)}${TEAM_COPY.missingB}`}
					<Text style={styles.missingStrong}>{podium.missing.gap}</Text>
					{TEAM_COPY.missingC}
				</Text>
			) : null}
		</GlassCard>
	);
};
