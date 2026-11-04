import { useMemo } from "react";

import { useMyTeam } from "@/lib/data";

import { IBuddyContext, rankOfPosition } from "./rules";
import { useBuddyStore } from "./store";

// Equipe, coroa (1º do ranking da semana na equipe, com pontos) e pódio da
// equipe no ranking semanal (cores metálicas).
export const useBuddyContext = (): IBuddyContext => {
	const { team } = useMyTeam();
	const hideCrown = useBuddyStore((s) => s.hideCrown);
	const teamName = team?.name ?? "";
	// Os integrantes já vêm do mais pontuado para o menos
	const top = team?.members.at(0);
	const isLeader = Boolean(top?.you) && (top?.pts ?? 0) > 0;
	const rank = rankOfPosition(team?.position);

	return useMemo(
		() => ({ teamName, isLeader, rank, hideCrown }),
		[teamName, isLeader, rank, hideCrown],
	);
};
