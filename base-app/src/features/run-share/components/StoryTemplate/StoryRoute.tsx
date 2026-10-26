import React from "react";

import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";

import { splitStopColor, useSvgId } from "@/components/pace";
import { useTheme } from "@/theme";

import { STORY } from "../../constants";
import { IStoryBox, projectRoute } from "../../utils/storyRoute";

import { IStoryPoint } from "./types";

interface IStoryRouteProps {
	box: IStoryBox;
	points: readonly IStoryPoint[];
	lineWidth?: number;
	hasGlow?: boolean;
	// Cor única (sem degradê, sem brilho e sem ponto de largada)
	solid?: string;
}

const GLOW_LAYERS = [
	{ width: 3.4, opacity: 0.12 },
	{ width: 2.2, opacity: 0.22 },
] as const;

// Percurso da corrida em laranja com brilho, como o drawRoute do design.
export const StoryRoute: React.FC<IStoryRouteProps> = ({
	box,
	points,
	lineWidth = 12,
	hasGlow = true,
	solid,
}) => {
	const { theme } = useTheme();
	const gradientId = useSvgId("story-route");
	const route = projectRoute(box, points);
	const stops = theme.pace.gradients.storyRoute[0].stops;
	const stroke = solid ?? `url(#${gradientId})`;
	const showGlow = hasGlow && !solid;

	if (!route.d) return null;

	return (
		<Svg
			width={STORY.width}
			height={STORY.height}
			style={{ position: "absolute", top: 0, left: 0 }}
			pointerEvents="none"
		>
			<Defs>
				<LinearGradient
					id={gradientId}
					gradientUnits="userSpaceOnUse"
					x1={box.x}
					y1={box.y}
					x2={box.x + box.w}
					y2={box.y + box.h}
				>
					{stops.map((s) => (
						<Stop key={s.offset} offset={s.offset} {...splitStopColor(s.color)} />
					))}
				</LinearGradient>
			</Defs>
			{showGlow
				? GLOW_LAYERS.map((g) => (
						<Path
							key={g.width}
							d={route.d}
							fill="none"
							stroke={theme.pace.colors.storyRouteGlow}
							strokeOpacity={g.opacity}
							strokeWidth={lineWidth * g.width}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					))
				: null}
			<Path
				d={route.d}
				fill="none"
				stroke={stroke}
				strokeWidth={lineWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			{solid ? null : (
				<Circle
					cx={route.start[0]}
					cy={route.start[1]}
					r={lineWidth * 1.3}
					fill={theme.pace.colors.ink.white}
				/>
			)}
		</Svg>
	);
};
