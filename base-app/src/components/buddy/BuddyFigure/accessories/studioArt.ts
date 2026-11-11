import { ImageSourcePropType } from "react-native";

import { IBuddyAccessoryId } from "@/lib/buddy/constants";

import astronauta from "../../../../../assets/studio/astronauta.png";
import espadas from "../../../../../assets/studio/espadas.png";
import espelhado from "../../../../../assets/studio/espelhado.png";
import fone from "../../../../../assets/studio/fone.png";
import gato from "../../../../../assets/studio/gato.png";
import mago from "../../../../../assets/studio/mago.png";
import narigao from "../../../../../assets/studio/narigao.png";
import ninja from "../../../../../assets/studio/ninja.png";
import oni from "../../../../../assets/studio/oni.png";
import paraquedas from "../../../../../assets/studio/paraquedas.png";
import robo from "../../../../../assets/studio/robo.png";
import samurai from "../../../../../assets/studio/samurai.png";
import vampiro from "../../../../../assets/studio/vampiro.png";
import viking from "../../../../../assets/studio/viking.png";

// Imagens 3D dos acessórios do Buddy Studio (assets/studio, recortadas do
// fundo verde). Cabeça/rosto/boca: coordenadas do corpo (88 × 70). Costas:
// coordenadas da figura inteira (140 × 135), atrás do corpo.
export interface IStudioArt {
	source: ImageSourcePropType;
	left: number;
	top: number;
	width: number;
	// Altura ÷ largura da imagem recortada
	ratio: number;
}

const art = (
	source: ImageSourcePropType,
	ratio: number,
	place: { left: number; top: number; width: number },
): IStudioArt => ({ source, ratio, ...place });

// Item sem imagem aqui continua com o desenho em vetor
export const STUDIO_ART: Partial<Record<IBuddyAccessoryId, IStudioArt>> = {
	mago: art(mago, 1.45, { left: 15, top: -74, width: 58 }),
	samurai: art(samurai, 0.695, { left: -8, top: -50, width: 104 }),
	viking: art(viking, 0.587, { left: -8, top: -46, width: 104 }),
	astronauta: art(astronauta, 0.949, { left: -13, top: -24, width: 114 }),
	robo: art(robo, 1.231, { left: -6, top: -37, width: 100 }),
	ninja: art(ninja, 1.171, { left: -7, top: -24, width: 102 }),
	gato: art(gato, 0.821, { left: -2, top: -52, width: 92 }),
	fone: art(fone, 0.979, { left: -16, top: -47, width: 120 }),
	espelhado: art(espelhado, 0.516, { left: -6, top: 4, width: 100 }),
	narigao: art(narigao, 0.904, { left: 10, top: 8, width: 68 }),
	oni: art(oni, 0.879, { left: -4, top: -4, width: 96 }),
	vampiro: art(vampiro, 0.744, { left: 23, top: 34, width: 42 }),
};

export const STUDIO_BACK_ART: Partial<Record<IBuddyAccessoryId, IStudioArt>> = {
	paraquedas: art(paraquedas, 1.047, { left: 10, top: -52, width: 120 }),
	espadas: art(espadas, 1.151, { left: 5, top: -12, width: 130 }),
};
