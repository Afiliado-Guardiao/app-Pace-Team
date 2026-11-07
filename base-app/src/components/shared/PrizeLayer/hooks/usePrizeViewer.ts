import { IPrize, PRIZES, usePrizeStore } from "@/lib/prizes";

import { usePrizeShare } from "./usePrizeShare";
import { usePrizeTilt } from "./usePrizeTilt";

// Prêmio aberto em tela cheia (Perfil, Desafios, Detalhes da equipe)
export const usePrizeViewer = () => {
	const viewer = usePrizeStore((s) => s.viewer);
	const close = usePrizeStore((s) => s.closePrize);
	const tilt = usePrizeTilt();
	const { ref, share } = usePrizeShare();
	const prize: IPrize | null = viewer ? PRIZES[viewer.id] : null;
	return { prize, isUnlocked: viewer?.isUnlocked ?? false, close, share, ref, ...tilt };
};
