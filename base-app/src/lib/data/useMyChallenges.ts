import { useQuery } from "@tanstack/react-query";

import { DEMO_MEDAL_IDS } from "@/lib/pace";
import { getMyChallenges, IMyChallenges } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

interface IUseMyChallengesReturn {
	challenges: IMyChallenges;
	isLoading: boolean;
}

const EMPTY: IMyChallenges = {
	weekKm: 0,
	weekRuns: 0,
	best5k: null,
	previousBest5k: null,
	team: null,
	medals: [],
};

// Prévia por link: os números do design (32,4 de 40 km, 4 de 5 treinos...)
const DEMO: IMyChallenges = {
	weekKm: 32.4,
	weekRuns: 4,
	best5k: null,
	previousBest5k: 1420,
	team: { name: "Pace Sharks", size: 5, weekKm: 182, goalKm: 250, streak: 6 },
	medals: [...DEMO_MEDAL_IDS],
};

const fetchChallenges = async (): Promise<IMyChallenges> => (IS_PREVIEW ? DEMO : getMyChallenges());

// Progresso dos desafios da semana/mês e medalhas conquistadas.
export const useMyChallenges = (): IUseMyChallengesReturn => {
	const query = useQuery({ queryKey: DATA_KEYS.challenges, queryFn: fetchChallenges });
	return { challenges: query.data ?? EMPTY, isLoading: query.isLoading };
};
