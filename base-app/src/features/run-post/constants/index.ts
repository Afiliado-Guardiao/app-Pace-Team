import { POST_SAMPLE_PHOTOS } from "@/lib/pace";

// Fotos de exemplo da câmera (miniaturas à esquerda do disparador)
export const POST_PHOTOS = POST_SAMPLE_PHOTOS;

// Corrida de exemplo quando não há uma corrida recente
export const POST_FALLBACK = { seconds: 1610, km: 5.24 } as const;
// Corridas muito curtas usam o exemplo (protótipo)
export const POST_MIN_KM = 0.3;

export const POST_COPY = {
	cameraTitle: "Foto da corrida",
	close: "Fechar",
	flash: "Flash",
	flip: "Virar câmera",
	shoot: "Tirar foto",
	photo: "Foto ",
	editTitle: "Postar no feed",
	stats: "Métricas",
	route: "Percurso",
	team: "Equipe",
	captionPlaceholder: "Escreva uma legenda…",
	publish: "Publicar no feed",
	demoNote: "Protótipo · foto e dados de exemplo",
	defaultCaption: "Corrida com a equipe.",
} as const;
