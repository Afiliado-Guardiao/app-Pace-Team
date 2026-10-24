import React from "react";
import { View } from "react-native";

import { GradientLayers, Logo } from "@/components/pace";
import { IPaceGradientName, ITheme, useTheme } from "@/theme";

import { SHARE_COPY } from "../../constants";

import { StoryText } from "./StoryText";
import { IStoryTeam } from "./types";

export interface IStoryTeamPillOptions {
	gradient?: IPaceGradientName;
	// Símbolo PACE TEAM no lugar da sigla
	hasMark?: boolean;
}

interface IStoryTeamPillProps {
	team: IStoryTeam;
	cx: number;
	y: number;
	options?: IStoryTeamPillOptions;
}

const W = 560;
const H = 112;
const SQUARE = 76;
const MARK_RATIO = 192 / 312;

const createStoryTeamPillStyles = (
	theme: ITheme,
	{ x, y, isUp }: { x: number; y: number; isUp: boolean },
) => {
	const { colors } = theme.pace;
	return {
		pill: {
			position: "absolute" as const,
			left: x,
			top: y,
			width: W,
			height: H,
			borderRadius: 28,
			borderWidth: 2,
			borderColor: colors.storyPillBorder,
			backgroundColor: colors.storyPillBg,
		},
		square: {
			position: "absolute" as const,
			left: x + 18,
			top: y + 18,
			width: SQUARE,
			height: SQUARE,
			borderRadius: 18,
			overflow: "hidden" as const,
		},
		mark: {
			position: "absolute" as const,
			left: x + 26,
			top: y + 56 - (60 * MARK_RATIO) / 2,
			width: 60,
			height: 60 * MARK_RATIO,
		},
		divider: {
			position: "absolute" as const,
			left: x + 380,
			top: y + 22,
			width: 2,
			height: H - 44,
			backgroundColor: colors.storyDivider,
		},
		trend: {
			position: "absolute" as const,
			left: x + 478,
			top: y + 32,
			width: 0,
			height: 0,
			borderLeftWidth: 12,
			borderRightWidth: 12,
			borderLeftColor: colors.transparent,
			borderRightColor: colors.transparent,
			...(isUp
				? { borderBottomWidth: 22, borderBottomColor: colors.trendUp }
				: { borderTopWidth: 22, borderTopColor: colors.trendDown }),
		},
	};
};

// Pílula da equipe dos stories: sigla/símbolo, nome, posição e tendência.
export const StoryTeamPill: React.FC<IStoryTeamPillProps> = ({ team, cx, y, options = {} }) => {
	const { theme } = useTheme();
	const { gradient = "teamMark", hasMark = false } = options;
	const { rank, isUp, initials } = team;
	const x = cx - W / 2;
	const styles = createStoryTeamPillStyles(theme, { x, y, isUp });

	return (
		<>
			<View style={styles.pill} />
			<View style={styles.square}>
				<GradientLayers layers={theme.pace.gradients[gradient]} width={SQUARE} height={SQUARE} />
			</View>
			{hasMark ? (
				<Logo variant="symbol" height={60 * MARK_RATIO} style={styles.mark} />
			) : (
				<StoryText x={x + 56} y={y + 69} size={30} weight={800} align="center">
					{initials}
				</StoryText>
			)}
			<StoryText x={x + 116} y={y + 54} size={30}>
				{team.name.toUpperCase()}
			</StoryText>
			<StoryText
				x={x + 116}
				y={y + 88}
				size={20}
				weight={600}
				color={theme.pace.colors.storyPillSub}
				spacing={2}
			>
				{SHARE_COPY.yourTeam}
			</StoryText>
			<View style={styles.divider} />
			<StoryText x={x + 410} y={y + 56} size={34} weight={800}>
				{`#${String(rank)}`}
			</StoryText>
			<View style={styles.trend} />
			<StoryText x={x + 410} y={y + 88} size={20} weight={600} spacing={2}>
				{SHARE_COPY.inRanking}
			</StoryText>
		</>
	);
};
