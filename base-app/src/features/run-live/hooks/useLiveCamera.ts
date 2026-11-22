import { useCallback, useState } from "react";

interface IUseLiveCameraReturn {
	// A pessoa arrastou ou deu zoom: a câmera não acompanha até tocar na mira
	isPaused: boolean;
	// Cada número novo leva a câmera até o atleta
	recenter: number;
	handleMove: () => void;
	handleBack: () => void;
}

// Câmera da corrida ao vivo: acompanha o atleta; se ele mexer no mapa, para
// de acompanhar e mostra a mira para voltar
export const useLiveCamera = (): IUseLiveCameraReturn => {
	const [isPaused, setIsPaused] = useState(false);
	const [recenter, setRecenter] = useState(0);

	return {
		isPaused,
		recenter,
		handleMove: useCallback(() => {
			setIsPaused(true);
		}, []),
		handleBack: useCallback(() => {
			setIsPaused(false);
			setRecenter((n) => n + 1);
		}, []),
	};
};
