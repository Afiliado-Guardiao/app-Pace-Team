import React from "react";
import { Text, View } from "react-native";

import { GradientLayers } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

interface IPostTeamBadgeProps {
	team: string;
	rank: number;
	isUp: boolean;
	cqw: number;
}

const COPY = { yourTeam: "Sua equipe", ranking: "No ranking" } as const;

const createPostTeamBadgeStyles = (theme: ITheme, cqw: number, isUp: boolean) => {
	const { colors, typography } = theme.pace;
	const caps = { fontFamily: typography.fonts.semibold, textTransform: "uppercase" as const };
	const arrow = 1.5 * cqw;
	return {
		root: {
			position: "absolute" as const,
			top: "71.5%" as const,
			alignSelf: "center" as const,
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: 2.6 * cqw,
			paddingVertical: 1.3 * cqw,
			paddingLeft: 1.3 * cqw,
			paddingRight: 2.4 * cqw,
			borderRadius: 1.8 * cqw,
			borderWidth: 1,
			borderColor: colors.postBadgeBorder,
			backgroundColor: colors.postBadgeBg,
		},
		mark: {
			width: 6 * cqw,
			height: 6 * cqw,
			borderRadius: 1.2 * cqw,
			overflow: "hidden" as const,
			alignItems: "center" as const,
			justifyContent: "center" as const,
		},
		markLayer: { position: "absolute" as const, top: 0, left: 0 },
		initials: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 2.4 * cqw,
			color: colors.ink.white,
		},
		team: { ...caps, fontSize: 2.3 * cqw, lineHeight: 2.3 * cqw * 1.1, color: colors.ink.white },
		sub: {
			...caps,
			marginTop: 0.5 * cqw,
			fontSize: 1.5 * cqw,
			lineHeight: 1.5 * cqw * 1.2,
			color: colors.postBadgeSub,
		},
		divider: { width: 1, alignSelf: "stretch" as const, backgroundColor: colors.postDivider },
		rankRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: cqw },
		rank: { fontFamily: typography.fonts.semibold, fontSize: 2.6 * cqw, color: colors.ink.white },
		trend: {
			width: 0,
			height: 0,
			borderLeftWidth: cqw,
			borderRightWidth: cqw,
			borderLeftColor: colors.transparent,
			borderRightColor: colors.transparent,
			...(isUp
				? { borderBottomWidth: arrow, borderBottomColor: colors.trendUp }
				: { borderTopWidth: arrow, borderTopColor: colors.trendDown }),
		},
		rankSub: {
			...caps,
			marginTop: 0.5 * cqw,
			fontSize: 1.5 * cqw,
			lineHeight: 1.5 * cqw * 1.2,
			color: colors.ink.white,
		},
	};
};

const initialsOf = (team: string): string =>
	team
		.split(" ")
		.map((w) => w.charAt(0))
		.join("")
		.slice(0, 2);

// Pílula da equipe na arte: sigla, nome, posição e tendência no ranking.
export const PostTeamBadge: React.FC<IPostTeamBadgeProps> = ({ team, rank, isUp, cqw }) => {
	const { theme } = useTheme();
	const styles = createPostTeamBadgeStyles(theme, cqw, isUp);
	const mark = 6 * cqw;

	return (
		<View style={styles.root} pointerEvents="none">
			<View style={styles.mark}>
				<View style={styles.markLayer}>
					<GradientLayers layers={theme.pace.gradients.teamMark} width={mark} height={mark} />
				</View>
				<Text style={styles.initials}>{initialsOf(team)}</Text>
			</View>
			<View>
				<Text style={styles.team}>{team}</Text>
				<Text style={styles.sub}>{COPY.yourTeam}</Text>
			</View>
			<View style={styles.divider} />
			<View>
				<View style={styles.rankRow}>
					<Text style={styles.rank}>{`#${String(rank)}`}</Text>
					<View style={styles.trend} />
				</View>
				<Text style={styles.rankSub}>{COPY.ranking}</Text>
			</View>
		</View>
	);
};
