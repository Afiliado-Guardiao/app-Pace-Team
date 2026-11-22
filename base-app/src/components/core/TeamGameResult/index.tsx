import React from "react";

import { ResultSheet } from "./ResultSheet";
import { useTeamGameResult } from "./useTeamGameResult";

// Pop-up do resultado da roleta, em qualquer tela
export const TeamGameResult: React.FC = () => {
	const { game, close } = useTeamGameResult();
	return game ? <ResultSheet game={game} onClose={close} /> : null;
};

export { useGameResultStore } from "./resultStore";
export { gamePointsText } from "./rows";
