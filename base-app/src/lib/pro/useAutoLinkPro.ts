import { useEffect, useRef } from "react";

import { useMyPro } from "@/lib/data";
import { linkMyProToTeam } from "@/lib/supabase";

// Assinou sem equipe e depois criou (ou entrou em) uma equipe que ainda não é
// PRO: a assinatura se liga sozinha a ela, sem a pessoa apertar nada.
export const useAutoLinkPro = (): void => {
	const { pro, refresh } = useMyPro();
	const tried = useRef<string | null>(null);
	const teamId = pro?.teamId ?? null;
	const shouldLink = Boolean(
		pro?.hasOwnSub && !pro.ownSubTeamId && teamId && !pro.teamPro && tried.current !== teamId,
	);

	useEffect(() => {
		if (!shouldLink || !teamId) return;
		tried.current = teamId;
		linkMyProToTeam()
			.then(() => refresh())
			.catch(() => undefined);
	}, [shouldLink, teamId, refresh]);
};
