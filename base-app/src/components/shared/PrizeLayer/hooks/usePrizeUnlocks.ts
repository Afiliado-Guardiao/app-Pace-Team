import { useEffect, useMemo } from "react";

import { useMyChallenges, useMyTeam, useTeamAchievements } from "@/lib/data";
import { IPrizeId, usePrizeStore } from "@/lib/prizes";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";

// Vigia as medalhas e as conquistas da equipe: o que liberou desde a última
// vez entra na fila do "Nova conquista!" (uma vez por conquista). Na primeira
// leitura de quem está logado, o que já tinha não comemora.
export const usePrizeUnlocks = (): void => {
	const userId = useStore((s) => s.user?.id ?? null);
	const { challenges, isLoaded: medalsLoaded } = useMyChallenges();
	const { team } = useMyTeam();
	const { achievements, isLoaded: teamLoaded } = useTeamAchievements(team?.id);
	const noteUnlocked = usePrizeStore((s) => s.noteUnlocked);

	const unlocked = useMemo<IPrizeId[]>(
		() => [
			...(challenges.medals as IPrizeId[]),
			...achievements.filter((a) => a.isUnlocked).map((a) => a.id),
		],
		[challenges.medals, achievements],
	);
	const key = unlocked.join(",");

	useEffect(() => {
		if (IS_PREVIEW || !userId || !medalsLoaded || !teamLoaded) return;
		noteUnlocked(userId, unlocked);
		// eslint-disable-next-line react-hooks/exhaustive-deps -- a lista muda junto com a chave
	}, [userId, medalsLoaded, teamLoaded, key, noteUnlocked]);
};
