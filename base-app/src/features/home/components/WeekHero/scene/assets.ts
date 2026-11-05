import buddy from "../../../../../../assets/hero/buddy.png";
import runner1 from "../../../../../../assets/hero/runner-1.png";
import runner2 from "../../../../../../assets/hero/runner-2.png";
import runner3 from "../../../../../../assets/hero/runner-3.png";
import runner4 from "../../../../../../assets/hero/runner-4.png";
import runner5 from "../../../../../../assets/hero/runner-5.png";
import track from "../../../../../../assets/hero/track.png";

// Imagens do Claude Design (fundo transparente): pista vazia, Buddy de
// pelúcia sentado e os corredores (todos olhando para a esquerda).
// runner-1 é a camisa laranja: sempre o próprio atleta.
// (No app, importar um PNG dá o número do módulo, que é o que o Skia aceita.)
const asModule = (m: unknown): number => m as number;

export const HERO_IMAGES = {
	track: asModule(track),
	buddy: asModule(buddy),
	me: asModule(runner1),
	mates: [runner2, runner3, runner4, runner5].map(asModule),
};
