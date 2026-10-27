import { useEffect } from "react";

import { watchGpsWhileActive } from "./gps";

// Liga o GPS assim que a área logada abre, para a tela de correr já
// encontrar a posição pronta.
export const useGpsWarmup = (): void => {
	useEffect(() => watchGpsWhileActive(), []);
};
