import React from "react";

import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";

import { splitStopColor, useSvgId } from "@/components/pace";
import { useTheme } from "@/theme";
import { fitCrewLines, IArtPoint, ICrewLine, linePath } from "@/lib/data";

import { STORY } from "../../constants";
import { IStoryBox } from "../../utils/storyRoute";

interface IStoryRouteProps {
	box: IStoryBox;
	// Percurso de cada um que correu (o do dono em laranja), no mesmo desenho
	lines: readonly ICrewLine[];
	lineWidth?: number;
	hasGlow?: boolean;
	// Cor única (sem degradê, sem brilho e sem ponto de largada)
	solid?: string;
}

const GLOW_LAYERS = [
	{ width: 3.4, opacity: 0.12 },
	{ width: 2.2, opacity: 0.22 },
] as const;
// Mesmo esticado de antes no eixo vertical
const LAT_STRETCH = 1.1;
// Quem andou quase nada: um pontinho (traço com ponta redonda)
const DOT = 0.5;
const MATE_WIDTH = 0.85;

const pathOf = (points: readonly IArtPoint[]): string => {
	const first = points.at(0);
	if (!first) return "";
	return points.length === 1 ? linePath([first, [first[0] + DOT, first[1]]]) : linePath(points);
};

// Percursos da corrida: o seu em laranja com brilho (como o drawRoute do
// design) e o de cada colega em branco, todos no lugar de verdade.
export const StoryRoute: React.FC<IStoryRouteProps> = ({
	box,
	lines,
	lineWidth = 12,
	hasGlow = true,
	solid,
}) => {
	const { theme } = useTheme();
	const gradientId = useSvgId("story-route");
	const fitted = fitCrewLines(
		lines.map((l) => l.points),
		box,
		LAT_STRETCH,
	);
	const paths = fitted.map((points, i) => ({
		d: pathOf(points),
		points,
		isOwner: lines[i]?.isOwner ?? false,
	}));
	const owner = paths.find((p) => p.isOwner && p.d);
	const stops = theme.pace.gradients.storyRoute[0].stops;
	const ownerStroke = solid ?? `url(#${gradientId})`;
	const showGlow = hasGlow && !solid;
	const start = owner?.points[0];

	if (!paths.some((p) => p.d)) return null;

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
			{paths.map((path, i) =>
				path.d && !path.isOwner ? (
					<React.Fragment key={`mate-${String(i)}`}>
						{showGlow ? (
							<Path
								d={path.d}
								fill="none"
								stroke={theme.pace.colors.crewRouteGlow}
								strokeWidth={lineWidth * 2.2}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						) : null}
						<Path
							d={path.d}
							fill="none"
							stroke={theme.pace.colors.crewRoute}
							strokeWidth={lineWidth * MATE_WIDTH}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</React.Fragment>
				) : null,
			)}
			{owner && showGlow
				? GLOW_LAYERS.map((g) => (
						<Path
							key={g.width}
							d={owner.d}
							fill="none"
							stroke={theme.pace.colors.storyRouteGlow}
							strokeOpacity={g.opacity}
							strokeWidth={lineWidth * g.width}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					))
				: null}
			{owner ? (
				<Path
					d={owner.d}
					fill="none"
					stroke={ownerStroke}
					strokeWidth={lineWidth}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			) : null}
			{start && !solid ? (
				<Circle
					cx={start[0]}
					cy={start[1]}
					r={lineWidth * 1.3}
					fill={theme.pace.colors.ink.white}
				/>
			) : null}
		</Svg>
	);
};
