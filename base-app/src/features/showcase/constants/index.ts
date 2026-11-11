import { ImageSourcePropType } from "react-native";

import { CREW, PHOTOS } from "@/lib/pace";

export interface ICollagePhoto {
	source: ImageSourcePropType;
	// Posição e tamanho na colagem (referência: tela de 390 de largura)
	x: number;
	y: number;
	w: number;
	h: number;
	rotate: number;
	// Foto oval (como na referência) ou cartão de cantos arredondados
	isOval?: boolean;
}

// Colagem do topo: fotos de corrida e de equipe com moldura branca
export const COLLAGE: readonly ICollagePhoto[] = [
	{ source: PHOTOS.runnerCitySunset, x: 14, y: 54, w: 150, h: 178, rotate: -7, isOval: true },
	{ source: PHOTOS.teamTrack, x: 146, y: 18, w: 156, h: 112, rotate: 5 },
	{ source: PHOTOS.teamRunningSunset, x: 236, y: 64, w: 142, h: 180, rotate: 7, isOval: true },
	{ source: PHOTOS.runnerMountain, x: 28, y: 236, w: 150, h: 112, rotate: -4 },
	{ source: PHOTOS.onbCrewGoggles, x: 140, y: 140, w: 116, h: 140, rotate: -2 },
	{ source: CREW[4] ?? PHOTOS.teamTrack, x: 222, y: 250, w: 150, h: 108, rotate: 5 },
];

// Altura da colagem na referência de 390 de largura
export const COLLAGE_H = 370;

export const SHOWCASE_COPY = {
	name: "Bud",
	lineA: "Cada corrida.",
	lineB: "Cada km.",
	lineC: "Juntos.",
	cta: "Começar",
	login: "Já tenho conta",
} as const;
