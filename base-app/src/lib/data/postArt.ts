import type { IRunCrewPin } from "./runCrew";

type IPoint = readonly [number, number];

// Foto de quem correu junto, como vai guardada no post (sem imagem local)
export interface IStoredCrewPin {
	photo: string | null;
	name: string;
	label?: string;
	at: number;
}

// O banco aceita até 600 pontos no desenho do post
const MAX_SHAPE_POINTS = 500;
const DECIMALS = 1e6;

const round = (n: number): number => Math.round(n * DECIMALS) / DECIMALS;

// Percurso → só o desenho: começa em [0, 0] e o x já vem corrigido pela
// latitude. Mantém o formato do traçado sem revelar onde foi a corrida
// (o feed nunca recebe coordenada de GPS).
export const routeShape = (route: readonly IPoint[]): [number, number][] => {
	const first = route.at(0);
	if (!first) return [];
	const kx = Math.cos((first[0] * Math.PI) / 180);
	const step = Math.max(1, Math.ceil(route.length / MAX_SHAPE_POINTS));
	return route
		.filter((_, i) => i % step === 0 || i === route.length - 1)
		.map(([lat, lng]) => [round(lat - first[0]), round((lng - first[1]) * kx)]);
};

const photoOf = (image: IRunCrewPin["image"]): string | null =>
	image && typeof image === "object" && "uri" in image && typeof image.uri === "string"
		? image.uri
		: null;

export const toStoredCrew = (crew: readonly IRunCrewPin[]): IStoredCrewPin[] =>
	crew.map((pin) => ({
		photo: photoOf(pin.image),
		name: pin.name,
		...(pin.label ? { label: pin.label } : {}),
		at: pin.at,
	}));

export const fromStoredCrew = (crew: readonly IStoredCrewPin[]): IRunCrewPin[] =>
	crew.map((pin) => ({
		image: pin.photo ? { uri: pin.photo } : undefined,
		name: pin.name,
		label: pin.label,
		at: pin.at,
	}));
