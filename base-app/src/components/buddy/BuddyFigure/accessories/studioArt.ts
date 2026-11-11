import { ImageSourcePropType } from "react-native";

import { IBuddyAccessoryId } from "@/lib/buddy/constants";

// Imagens 3D dos acessórios do Buddy Studio (assets/studio, recortadas do
// fundo verde). Posição em coordenadas do corpo (88 × 70): left/top/width;
// a altura sai da proporção da imagem.
export interface IStudioArt {
	source: ImageSourcePropType;
	left: number;
	top: number;
	width: number;
	// Altura ÷ largura da imagem recortada
	ratio: number;
}

// Item sem imagem aqui continua com o desenho em vetor
export const STUDIO_ART: Partial<Record<IBuddyAccessoryId, IStudioArt>> = {};
