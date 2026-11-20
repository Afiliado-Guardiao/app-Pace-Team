import { Asset } from "expo-asset";

import buddy from "../../../../../../assets/hero/buddy.png";
import runner1 from "../../../../../../assets/hero/runner-1.png";
import runner2 from "../../../../../../assets/hero/runner-2.png";
import runner3 from "../../../../../../assets/hero/runner-3.png";
import runner4 from "../../../../../../assets/hero/runner-4.png";
import runner5 from "../../../../../../assets/hero/runner-5.png";
import track from "../../../../../../assets/hero/track.png";

// Só na prévia web: o Skia do navegador não acha a imagem pelo número do
// módulo (a pista e os corredores não apareciam). Aqui vai o endereço da
// imagem. No iPhone vale o assets.ts, sem mudanças.
const asUri = (m: unknown): number => Asset.fromModule(m as number).uri as unknown as number;

export const HERO_IMAGES = {
	track: asUri(track),
	buddy: asUri(buddy),
	me: asUri(runner1),
	mates: [runner2, runner3, runner4, runner5].map(asUri),
};
