import React from "react";
import { View } from "react-native";

import { GradientLayers } from "@/components/pace";
import { useTheme } from "@/theme";
import { formatKm, formatPace, MEMBERS, MY_TEAM } from "@/lib/pace";

import { IShareTemplateId, SHARE_COPY, STORY } from "../../constants";
import { storyDuration } from "../../utils/storyRoute";

import { StoryLogo } from "./StoryLogo";
import { StoryRoute } from "./StoryRoute";
import { StoryTeamPill } from "./StoryTeamPill";
import { StoryText } from "./StoryText";
import { IStoryRun } from "./types";

interface IFeatureTemplatesProps {
	id: Extract<IShareTemplateId, "destaque" | "integrantes" | "minimal">;
	run: IStoryRun;
}

const CX = STORY.width / 2;
const BAR = { x: 190, w: 760, h: 20 } as const;
const DEMO_POINTS = "+86";
const RANKED = [...MEMBERS].sort((a, b) => b.km - a.km);
const MAX_KM = RANKED[0]?.km ?? 1;

// Modelos de destaque: km gigante, ranking de integrantes e minimalista.
export const FeatureTemplates: React.FC<IFeatureTemplatesProps> = ({ id, run }) => {
	const { theme } = useTheme();
	const { colors } = theme.pace;
	const km = formatKm(run.km);
	const pace = formatPace(run.km ? run.seconds / run.km : 0);
	const time = storyDuration(run.seconds);
	const medals = [colors.storyGold, colors.storySilver, colors.storyBronze];

	if (id === "destaque") {
		const stats = [
			[SHARE_COPY.pace, pace],
			[SHARE_COPY.time, time],
			[SHARE_COPY.points, DEMO_POINTS],
		] as const;
		return (
			<>
				<StoryRoute box={{ x: 300, y: 260, w: 480, h: 420 }} lineWidth={11} />
				<StoryText x={CX} y={1040} size={280} weight={800} align="center" spacing={-6}>
					{km}
				</StoryText>
				<StoryText
					x={CX}
					y={1120}
					size={34}
					color={colors.storyAccentText}
					align="center"
					spacing={6}
				>
					{SHARE_COPY.kmWithTeam}
				</StoryText>
				{stats.map(([label, value], i) => (
					<React.Fragment key={label}>
						<StoryText x={220 + i * 320} y={1320} size={62} weight={800} align="center">
							{value}
						</StoryText>
						<StoryText
							x={220 + i * 320}
							y={1372}
							size={24}
							weight={600}
							color={colors.storyLabel}
							align="center"
							spacing={3}
						>
							{label.toUpperCase()}
						</StoryText>
					</React.Fragment>
				))}
				<StoryTeamPill
					cx={CX}
					y={1450}
					options={{ hasMark: true, gradient: "storyMarkNavy", rank: 3 }}
				/>
				<StoryLogo x={CX - 200} y={1680} width={400} />
			</>
		);
	}

	if (id === "integrantes") {
		return (
			<>
				<StoryText x={90} y={230} size={34} color={colors.storyAccentText} spacing={6}>
					{SHARE_COPY.teamRun}
				</StoryText>
				<StoryText x={90} y={330} size={96} weight={800}>
					{MY_TEAM.name}
				</StoryText>
				<StoryText
					x={90}
					y={410}
					size={40}
					weight={600}
				>{`${km} km  ·  ${time}  ·  ${pace}/km`}</StoryText>
				{RANKED.map((m, i) => {
					const y = 560 + i * 150;
					return (
						<React.Fragment key={m.name}>
							<StoryText
								x={90}
								y={y + 48}
								size={44}
								weight={800}
								color={medals[i] ?? colors.storyMuted}
							>{`${String(i + 1)}º`}</StoryText>
							<StoryText x={BAR.x} y={y + 30} size={38}>
								{m.you ? SHARE_COPY.you : m.name}
							</StoryText>
							<View
								style={{
									position: "absolute",
									left: BAR.x,
									top: y + 58,
									width: BAR.w,
									height: BAR.h,
									borderRadius: 10,
									backgroundColor: colors.storyBarTrack,
								}}
							/>
							<View
								style={{
									position: "absolute",
									left: BAR.x,
									top: y + 58,
									width: (BAR.w * m.km) / MAX_KM,
									height: BAR.h,
									borderRadius: 10,
									overflow: "hidden",
								}}
							>
								<GradientLayers
									layers={theme.pace.gradients.storyBar}
									width={BAR.w}
									height={BAR.h}
								/>
							</View>
							<StoryText
								x={BAR.x + BAR.w}
								y={y + 30}
								size={34}
								align="right"
							>{`${formatKm(m.km, 1)} km`}</StoryText>
						</React.Fragment>
					);
				})}
				<StoryTeamPill cx={CX} y={1440} />
				<StoryLogo x={CX - 200} y={1680} width={400} />
			</>
		);
	}

	return (
		<>
			<StoryTeamPill
				cx={CX}
				y={170}
				options={{ initials: "PS", gradient: "storyMarkPeach", rank: 6, isUp: false }}
			/>
			<StoryRoute box={{ x: 140, y: 420, w: 800, h: 820 }} lineWidth={16} />
			<StoryText x={90} y={1540} size={120} weight={800} spacing={-2}>{`${km} KM`}</StoryText>
			<StoryText x={90} y={1610} size={34} weight={600} spacing={3}>
				{`${time}   ${pace}/km   ${MY_TEAM.name.toUpperCase()}`}
			</StoryText>
			<StoryLogo x={STORY.width - 390} y={1720} width={300} />
		</>
	);
};
