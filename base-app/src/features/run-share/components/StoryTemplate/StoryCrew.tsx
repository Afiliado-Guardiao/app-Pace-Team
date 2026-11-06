import React from "react";

import { fitCrewLines, IArtPoint, layoutCrewPins, pinAnchors } from "@/lib/data";

import { STORY } from "../../constants";
import { projectRoute } from "../../utils/storyRoute";

import { StoryPin } from "./StoryPin";
import { IStoryRun } from "./types";

interface IStoryCrewProps {
	box: { x: number; y: number; w: number; h: number };
	run: IStoryRun;
	// Raio das fotos
	radius?: number;
}

const MAX_PINS = 8;
// Mesmo esticado do traçado (StoryRoute)
const LAT_STRETCH = 1.1;
// Alfinete: anel de 7, haste de 26; nome com ~360 de largura e 40 de altura
const RING = 7;
const STEM = 26;
const LABEL_W = 360;
const LABEL_H = 40;
const GAP = 22;
// Margem das bordas do story
const EDGE = 24;

// Onde fica cada foto: no fim do percurso de cada um (prévia por link: ao
// longo do percurso único, como antes)
const anchorsOf = (run: IStoryRun, box: IStoryCrewProps["box"]): IArtPoint[] => {
	const crew = run.crew.slice(0, MAX_PINS);
	if (crew.every((p) => p.line === undefined)) {
		const route = projectRoute(box, run.route);
		return crew.map((p) => route.at(p.at));
	}
	const fitted = fitCrewLines(
		run.lines.map((l) => l.points),
		box,
		LAT_STRETCH,
	);
	return pinAnchors(
		fitted,
		crew.map((p) => p.line ?? 0),
		box,
	);
};

// Foto de cada um que correu junto no fim do percurso dele, com o nome e
// quanto correu; foto e nome nunca cobrem os de outro
export const StoryCrew: React.FC<IStoryCrewProps> = ({ box, run, radius = 54 }) => {
	const crew = run.crew.slice(0, MAX_PINS);
	const metrics = {
		pinW: (radius + RING) * 2,
		pinH: radius * 2 + STEM + RING,
		labelW: LABEL_W,
		labelH: LABEL_H,
		gap: GAP,
	};
	const placed = layoutCrewPins(anchorsOf(run, box), {
		metrics,
		hasLabel: crew.map((p) => Boolean(p.label)),
		bounds: { minX: EDGE, maxX: STORY.width - EDGE },
	});

	return (
		<>
			{/* De trás para frente: a primeira foto (dono) fica por cima */}
			{[...crew.entries()].reverse().map(([i, pin]) => (
				<StoryPin
					key={`${pin.name}-${String(i)}`}
					image={pin.image}
					name={pin.name}
					label={pin.label}
					x={placed[i]?.x ?? 0}
					y={placed[i]?.y ?? 0}
					labelAbove={placed[i]?.labelAbove}
					dotX={placed[i]?.anchorX}
					dotY={placed[i]?.anchorY}
					radius={radius}
				/>
			))}
		</>
	);
};
