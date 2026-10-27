import React from "react";

import { projectRoute } from "../../utils/storyRoute";

import { StoryPin } from "./StoryPin";
import { IStoryRun } from "./types";

interface IStoryCrewProps {
	box: { x: number; y: number; w: number; h: number };
	run: IStoryRun;
	// Raio das fotos (o primeiro, você, um pouco maior)
	radius?: number;
}

// Onde cada foto fica no traçado (fração do percurso)
const CREW_AT = [0.92, 0.66, 0.4, 0.16] as const;

// Fotos redondas de quem correu junto, em cima do percurso
export const StoryCrew: React.FC<IStoryCrewProps> = ({ box, run, radius = 54 }) => {
	const route = projectRoute(box, run.route);
	const crew = run.crew.slice(0, CREW_AT.length);

	return (
		<>
			{crew.map((photo, i) => {
				const [x, y] = route.at(CREW_AT[i] ?? 0);
				return (
					<StoryPin key={i} image={photo} x={x} y={y} radius={i === 0 ? radius + 4 : radius} />
				);
			})}
		</>
	);
};
