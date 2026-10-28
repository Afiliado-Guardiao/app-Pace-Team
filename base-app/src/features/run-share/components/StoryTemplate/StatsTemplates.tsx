import React from "react";

import { useTheme } from "@/theme";
import { formatDistance, formatPace } from "@/lib/pace";

import { IShareTemplateId, SHARE_COPY, STORY } from "../../constants";
import { storyDuration } from "../../utils/storyRoute";

import { StoryCrew } from "./StoryCrew";
import { StoryLogo } from "./StoryLogo";
import { StoryRoute } from "./StoryRoute";
import { StoryTeamPill } from "./StoryTeamPill";
import { StoryText } from "./StoryText";
import { IStoryRun } from "./types";

interface IStatsTemplatesProps {
	id: Extract<IShareTemplateId, "equipe" | "centro" | "classico">;
	run: IStoryRun;
}

const CX = STORY.width / 2;
const EQUIPE_BOX = { x: 150, y: 760, w: 780, h: 600 };
const CENTRO_BOX = { x: CX - 190, y: 1120, w: 380, h: 340 };
const CLASSICO_BOX = { x: 160, y: 760, w: 760, h: 620 };
const MAX_CREW = 4;

const statsOf = (run: IStoryRun): readonly (readonly [string, string])[] => [
	[SHARE_COPY.distance, formatDistance(run.km)],
	[SHARE_COPY.pace, `${formatPace(run.km ? run.seconds / run.km : 0)} min/km`],
	[SHARE_COPY.time, storyDuration(run.seconds)],
];

// Modelos com as três métricas em destaque: Equipe, Centro e Clássico.
export const StatsTemplates: React.FC<IStatsTemplatesProps> = ({ id, run }) => {
	const { theme } = useTheme();
	const stats = statsOf(run);

	if (id === "centro") {
		return (
			<>
				{stats.map(([label, value], i) => (
					<React.Fragment key={label}>
						<StoryText x={CX} y={470 + i * 200} size={40} align="center">
							{label}
						</StoryText>
						<StoryText x={CX} y={574 + i * 200} size={112} weight={800} align="center" spacing={-1}>
							{value}
						</StoryText>
					</React.Fragment>
				))}
				<StoryRoute
					box={CENTRO_BOX}
					points={run.route}
					lineWidth={7}
					hasGlow={false}
					solid={theme.pace.colors.storyRouteSolid}
				/>
				<StoryCrew box={CENTRO_BOX} run={run} radius={36} />
				{run.team ? <StoryTeamPill team={run.team} cx={CX} y={1500} /> : null}
				<StoryLogo x={CX - 170} y={1690} width={340} />
			</>
		);
	}

	if (id === "classico") {
		return (
			<>
				{stats.map(([label, value], i) => (
					<React.Fragment key={label}>
						<StoryText x={90} y={210 + i * 190} size={40} weight={600}>
							{label}
						</StoryText>
						<StoryText x={90} y={290 + i * 190} size={76} weight={800}>
							{value}
						</StoryText>
					</React.Fragment>
				))}
				<StoryRoute box={CLASSICO_BOX} points={run.route} lineWidth={13} />
				<StoryCrew box={CLASSICO_BOX} run={run} />
				{run.team ? <StoryTeamPill team={run.team} cx={CX} y={1460} /> : null}
				<StoryLogo x={CX - 200} y={1680} width={400} />
			</>
		);
	}

	const crewSize = Math.min(run.crew.length, MAX_CREW);
	const runners = crewSize > 1 ? `${String(crewSize)}${SHARE_COPY.runners}` : "";

	return (
		<>
			{stats.map(([label, value], i) => (
				<React.Fragment key={label}>
					<StoryText x={90} y={190 + i * 170} size={38} weight={600}>
						{label}
					</StoryText>
					<StoryText x={90} y={262 + i * 170} size={70} weight={800}>
						{value}
					</StoryText>
				</React.Fragment>
			))}
			<StoryText
				x={STORY.width - 90}
				y={190}
				size={30}
				color={theme.pace.colors.storyAccentText}
				align="right"
				spacing={5}
			>
				{SHARE_COPY.teamRun}
			</StoryText>
			<StoryText x={STORY.width - 90} y={240} size={36} align="right">
				{runners}
			</StoryText>
			<StoryRoute box={EQUIPE_BOX} points={run.route} lineWidth={12} />
			<StoryCrew box={EQUIPE_BOX} run={run} />
			{run.team ? <StoryTeamPill team={run.team} cx={CX} y={1460} /> : null}
			<StoryLogo x={CX - 200} y={1680} width={400} />
		</>
	);
};
