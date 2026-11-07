import React from "react";

import { usePrizeUnlocks } from "./hooks/usePrizeUnlocks";
import { PrizeCelebration } from "./PrizeCelebration";
import { PrizeViewer } from "./PrizeViewer";

// Prêmios por cima de todas as telas da área logada: tela cheia ao tocar e o
// "Nova conquista!" quando libera uma medalha ou conquista da equipe
export const PrizeLayer: React.FC = () => {
	usePrizeUnlocks();
	return (
		<>
			<PrizeViewer />
			<PrizeCelebration />
		</>
	);
};
