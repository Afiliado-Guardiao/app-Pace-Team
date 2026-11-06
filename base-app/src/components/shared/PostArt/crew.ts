import { ImageSourcePropType } from "react-native";

import {
	fitCrewLines,
	ICrewLine,
	IRunCrewPin,
	layoutCrewPins,
	linePath,
	pinAnchors,
} from "@/lib/data";

// Mesma área do percurso único (entre as métricas e o selo da equipe)
const BOX = { x: 18, y: 36, w: 64, h: 54 } as const;
const ASPECT = 1.4;
const MAX_PINS = 8;
// Foto (9% da largura + a ponta) e o nome embaixo, em unidades da arte
const METRICS = { pinW: 9, pinH: 11, labelW: 27, labelH: 3.6, gap: 0.8 };
// Quem andou quase nada: um pontinho (o traço com ponta redonda)
const DOT = 0.01;

export interface IPostCrewPath {
	d: string;
	isOwner: boolean;
}

export interface IPostCrewPin {
	image?: ImageSourcePropType;
	name: string;
	label?: string;
	// Ponta do alfinete em % da arte
	x: number;
	y: number;
	labelAbove: boolean;
}

export interface IPostCrewArt {
	paths: IPostCrewPath[];
	pins: IPostCrewPin[];
}

const pathOf = (points: readonly (readonly [number, number])[]): string => {
	const first = points.at(0);
	if (!first) return "";
	return points.length === 1
		? linePath([first, [first[0] + DOT, first[1]]], 2)
		: linePath(points, 2);
};

// Todos os percursos no mesmo desenho e a foto de cada um no fim do dele,
// sem foto ou nome cobrindo outro
export const postCrewArt = (track: {
	lines: readonly ICrewLine[];
	crew: readonly IRunCrewPin[];
}): IPostCrewArt => {
	const fitted = fitCrewLines(
		track.lines.map((l) => l.points),
		BOX,
		1 / ASPECT,
	);
	const crew = track.crew.slice(0, MAX_PINS);
	const anchors = pinAnchors(
		fitted,
		crew.map((p) => p.line ?? 0),
		BOX,
	);
	const placed = layoutCrewPins(anchors, {
		metrics: METRICS,
		hasLabel: crew.map((p) => Boolean(p.label)),
	});
	return {
		paths: fitted.map((points, i) => ({
			d: pathOf(points),
			isOwner: track.lines[i]?.isOwner ?? false,
		})),
		pins: crew.map((pin, i) => ({
			image: pin.image,
			name: pin.name,
			label: pin.label,
			x: placed[i]?.x ?? 50,
			y: ((placed[i]?.y ?? 70) / 140) * 100,
			labelAbove: placed[i]?.labelAbove ?? false,
		})),
	};
};
