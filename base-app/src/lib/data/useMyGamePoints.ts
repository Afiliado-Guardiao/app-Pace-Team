import { useQuery } from "@tanstack/react-query";

import { getMyGamePoints, IGamePoints } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

const NONE: IGamePoints[] = [];

// Roletas da equipe em que joguei, com os pontos ganhos ou perdidos
export const useMyGamePoints = (): { games: IGamePoints[] } => {
	const query = useQuery({
		queryKey: DATA_KEYS.gamePoints,
		queryFn: getMyGamePoints,
		enabled: !IS_PREVIEW,
	});
	return { games: query.data ?? NONE };
};
