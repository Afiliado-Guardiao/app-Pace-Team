import { ImageSourcePropType } from "react-native";

import { PHOTOS } from "@/lib/pace";

import appIconTile from "../../../../assets/brand/app-icon-tile.png";

export const APP_ICON_TILE = appIconTile;

export interface IOnboardingSlide {
	image: ImageSourcePropType;
	lineA: string;
	lineB: string;
	text: string;
}

export const SLIDES: readonly IOnboardingSlide[] = [
	{
		image: PHOTOS.onbCrewGoggles,
		lineA: "Monte sua",
		lineB: "equipe",
		text: "Crie um time, convide seus amigos e corram juntos por um objetivo em comum.",
	},
	{
		image: PHOTOS.onbRoute,
		lineA: "Cada km",
		lineB: "conta",
		text: "Registre suas corridas por GPS, acumule pontos e ajude seu time a subir.",
	},
];

// O último passo é a animação "órbita" (fora da lista de fotos)
export const STEP_COUNT = SLIDES.length + 1;

export const ONBOARDING_COPY = {
	skip: "Pular",
	next: "Próximo",
	orbitText: "Conecte-se com seus amigos, corra junto e",
	orbitHighlight: "suba no ranking",
	brand: "PACE TEAM",
} as const;

export const SLIDE_FADE = 600;

// Linha do tempo da órbita, em segundos (OrbitIntro.jsx)
export const ORBIT = {
	radius: 122,
	tile: 64,
	tileRadius: 20,
	icon: 100,
	iconRadius: 28,
	centerYRatio: 360 / 844,
	inStart: 0.25,
	inStagger: 0.11,
	inDuration: 1.35,
	iconAt: 1.5,
	textAt: 1.9,
	outAt: 4.0,
	outDuration: 0.75,
	endAt: 5.0,
	spinPerSecond: 22,
	textGap: 92,
	ringOuter: 52,
	ringInner: -30,
} as const;
