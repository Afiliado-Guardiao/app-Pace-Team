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

const MAX_PINS = 4;
// Duas fotos no mesmo lugar (ex.: os dois parados na largada): lado a lado
const NEAR = 40;

// Foto de cada um que correu junto no lugar dele no percurso, com o nome e
// quanto correu
export const StoryCrew: React.FC<IStoryCrewProps> = ({ box, run, radius = 54 }) => {
	const route = projectRoute(box, run.route);
	const placed: (readonly [number, number])[] = [];
	const pins = run.crew.slice(0, MAX_PINS).map((pin) => {
		const [x, y] = route.at(pin.at);
		const crowd = placed.filter(([px, py]) => Math.abs(px - x) < NEAR && Math.abs(py - y) < NEAR);
		placed.push([x, y]);
		return { pin, x: x + crowd.length * (radius * 2 + 40), y };
	});

	return (
		<>
			{pins.map(({ pin, x, y }, i) => (
				<StoryPin
					key={`${pin.name}-${String(i)}`}
					image={pin.image}
					name={pin.name}
					label={pin.label}
					x={x}
					y={y}
					radius={radius}
				/>
			))}
		</>
	);
};
