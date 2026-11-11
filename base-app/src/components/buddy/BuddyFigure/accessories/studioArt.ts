import { ImageSourcePropType } from "react-native";

import { IBuddyAccessoryId } from "@/lib/buddy/constants";

import astronauta from "../../../../../assets/studio/astronauta.png";
import espadas from "../../../../../assets/studio/espadas.png";
import espelhado from "../../../../../assets/studio/espelhado.png";
import fone from "../../../../../assets/studio/fone.png";
import gato from "../../../../../assets/studio/gato.png";
import hyottoko from "../../../../../assets/studio/hyottoko.png";
import kitsune from "../../../../../assets/studio/kitsune.png";
import mago from "../../../../../assets/studio/mago.png";
import narigao from "../../../../../assets/studio/narigao.png";
import ondas from "../../../../../assets/studio/ondas.png";
import oni from "../../../../../assets/studio/oni.png";
import palha from "../../../../../assets/studio/palha.png";
import paraquedas from "../../../../../assets/studio/paraquedas.png";
import robo from "../../../../../assets/studio/robo.png";
import samurai from "../../../../../assets/studio/samurai.png";
import sorriso from "../../../../../assets/studio/sorriso.png";
import tribal from "../../../../../assets/studio/tribal.png";
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
	// Altura ÷ largura (menor que a da imagem achata, com isStretch)
	ratio: number;
	isStretch?: boolean;
}

const art = (
	source: ImageSourcePropType,
	ratio: number,
	place: { left: number; top: number; width: number; isStretch?: boolean },
): IStudioArt => ({ source, ratio, ...place });

// Item sem imagem aqui continua com o desenho em vetor
export const STUDIO_ART: Partial<Record<IBuddyAccessoryId, IStudioArt>> = {
	mago: art(mago, 1.45, { left: 15, top: -74, width: 58 }),
	samurai: art(samurai, 0.695, { left: -8, top: -50, width: 104 }),
	viking: art(viking, 0.587, { left: -8, top: -46, width: 104 }),
	astronauta: art(astronauta, 0.949, { left: -13, top: -24, width: 114 }),
	robo: art(robo, 1.231, { left: -6, top: -37, width: 100 }),
	espelhado: art(espelhado, 0.516, { left: -6, top: 4, width: 100 }),
	narigao: art(narigao, 0.904, { left: 10, top: 8, width: 68 }),
	oni: art(oni, 0.879, { left: -4, top: -4, width: 96 }),
	vampiro: art(vampiro, 0.744, { left: 23, top: 34, width: 42 }),
	palha: art(palha, 0.49, { left: -8, top: -40, width: 104 }),
	kitsune: art(kitsune, 0.822, { left: 4, top: -2, width: 84 }),
	ondas: art(ondas, 1.1, { left: 5, top: -2, width: 80, isStretch: true }),
	tribal: art(tribal, 1.0, { left: 6, top: -1, width: 78, isStretch: true }),
	hyottoko: art(hyottoko, 1.05, { left: 4, top: -10, width: 80, isStretch: true }),
	sorriso: art(sorriso, 0.62, { left: 11, top: 34, width: 66, isStretch: true }),
};

// Atrás do corpo (figura 140 × 135): costas e o que abraça a cabeça por trás
export const STUDIO_BACK_ART: Partial<Record<IBuddyAccessoryId, IStudioArt>> = {
	fone: art(fone, 0.979, { left: 10, top: -15, width: 120 }),
	gato: art(gato, 0.821, { left: 24, top: 4, width: 92 }),
	paraquedas: art(paraquedas, 1.047, { left: 10, top: -52, width: 120 }),
	espadas: art(espadas, 1.151, { left: 5, top: -12, width: 130 }),
};
