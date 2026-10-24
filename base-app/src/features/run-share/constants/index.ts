import { ImageSourcePropType } from "react-native";

import { IPaceGradientName } from "@/theme";
import { PHOTOS } from "@/lib/pace";

// Arte dos stories em pixels (exportada em 1080 × 1920)
export const STORY = { width: 1080, height: 1920 } as const;

export const SHARE_FALLBACK = { seconds: 1610, km: 5.24 } as const;

export type IShareTemplateId =
	| "equipe"
	| "centro"
	| "classico"
	| "destaque"
	| "integrantes"
	| "minimal";

export const SHARE_TEMPLATES: readonly { id: IShareTemplateId; name: string }[] = [
	{ id: "equipe", name: "Equipe" },
	{ id: "centro", name: "Centro" },
	{ id: "classico", name: "Clássico" },
	{ id: "destaque", name: "Destaque" },
	{ id: "integrantes", name: "Integrantes" },
	{ id: "minimal", name: "Minimal" },
];

export interface IShareBackground {
	id: string;
	label: string;
	photo?: ImageSourcePropType;
	gradient?: IPaceGradientName;
}

export const SHARE_BGS: readonly IShareBackground[] = [
	{ id: "none", label: "Sem fundo" },
	{ id: "photo1", label: "Pista", photo: PHOTOS.teamTrack },
	{ id: "photo2", label: "Pôr do sol", photo: PHOTOS.teamRunningSunset },
	{ id: "photo3", label: "Cidade", photo: PHOTOS.citySkylineDusk },
	{ id: "orange", label: "Laranja", gradient: "storyBgOrange" },
	{ id: "night", label: "Noite", gradient: "storyBgNight" },
];

export const SHARE_COPY = {
	title: "Compartilhar",
	templates: "Templates",
	background: "Fundo",
	share: "Compartilhar",
	notePlain: "PNG sem fundo · cole por cima da sua foto",
	notePhoto: "Imagem 1080×1920 para stories",
	noteDemo: " · dados de exemplo",
	template: "Template ",
	toastShared: "Pronto para compartilhar",
	toastUnavailable: "Compartilhar imagem fica disponível no app do iPhone",
	toastError: "Não foi possível gerar a imagem",
	teamRun: "CORRIDA DA EQUIPE",
	runners: " corredores",
	kmWithTeam: "QUILÔMETROS COM A EQUIPE",
	yourTeam: "SUA EQUIPE",
	inRanking: "NO RANKING",
	distance: "Distância",
	pace: "Ritmo",
	time: "Tempo",
	points: "Pontos",
	you: "Você",
	noTeam: "SEM EQUIPE",
} as const;
