import { useMemo } from "react";

import { useMyTeam } from "@/lib/data";

import { IBuddyContext, rankOfPosition } from "./rules";

// Equipe, liderança (coroa) e pódio no ranking semanal (cores metálicas).
export const useBuddyContext = (): IBuddyContext => {
	const { team } = useMyTeam();
	const teamName = team?.name ?? "";
	const isLeader = team?.isCaptain ?? false;
	const rank = rankOfPosition(team?.position);

	return useMemo(() => ({ teamName, isLeader, rank }), [teamName, isLeader, rank]);
};
