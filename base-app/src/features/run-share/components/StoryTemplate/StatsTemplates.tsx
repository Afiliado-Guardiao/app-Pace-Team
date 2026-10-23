import React from "react";

import { useTheme } from "@/theme";
import { formatKm, formatPace, ONLINE } from "@/lib/pace";

import { IShareTemplateId, SHARE_COPY, STORY } from "../../constants";
import { projectRoute, storyDuration } from "../../utils/storyRoute";

import { StoryLogo } from "./StoryLogo";
import { StoryPin } from "./StoryPin";
import { StoryRoute } from "./StoryRoute";
import { StoryTeamPill } from "./StoryTeamPill";
import { StoryText } from "./StoryText";
import { IStoryRun } from "./types";

interface IStatsTemplatesProps {
	id: Extract<IShareTemplateId, "equipe" | "centro" | "classico">;
	run: IStoryRun;
}

const CX = STORY.width / 2;
const CREW_AT = [0.06, 0.3, 0.55, 0.8] as const;
const EQUIPE_BOX = { x: 150, y: 760, w: 780, h: 600 };

const statsOf = (run: IStoryRun): readonly (readonly [string, string])[] => [
	[SHARE_COPY.distance, `${formatKm(run.km)} km`],
	[SHARE_COPY.pace, `${formatPace(run.km ? run.seconds / run.km : 0)} /km`],
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
					box={{ x: CX - 190, y: 1120, w: 380, h: 340 }}
					lineWidth={7}
					hasGlow={false}
					solid={theme.pace.colors.storyRouteSolid}
				/>
				<StoryTeamPill cx={CX} y={1500} />
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
				<StoryRoute box={{ x: 160, y: 760, w: 760, h: 620 }} lineWidth={13} />
				<StoryTeamPill cx={CX} y={1460} />
				<StoryLogo x={CX - 200} y={1680} width={400} />
			</>
		);
	}

	const route = projectRoute(EQUIPE_BOX);
	const crew = ONLINE.slice(0, CREW_AT.length);

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
				{`${String(crew.length + 1)}${SHARE_COPY.runners}`}
			</StoryText>
			<StoryRoute box={EQUIPE_BOX} lineWidth={12} />
			{crew.map((friend, i) => {
				const [x, y] = route.at(CREW_AT[i] ?? 0);
				return (
					<StoryPin key={friend.name} image={friend.image} x={x} y={y} radius={i === 0 ? 58 : 50} />
				);
			})}
			<StoryTeamPill cx={CX} y={1460} />
			<StoryLogo x={CX - 200} y={1680} width={400} />
		</>
	);
};
