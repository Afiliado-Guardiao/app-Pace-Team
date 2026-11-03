import { useRouter } from "expo-router";

import { ILastRunInput, setLastRun } from "@/lib/data";

// Compartilhar / Postar: corrida aberta pelo Histórico (ou por um aviso) vira
// a "última corrida", para a arte ser desta corrida e não da última feita.
export const useOpenRunArt = (opened: ILastRunInput | null): ((route: string) => void) => {
	const router = useRouter();

	return (route) => {
		if (opened) setLastRun(opened);
		router.push(route);
	};
};
