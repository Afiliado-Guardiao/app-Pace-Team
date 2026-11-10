import { useMemo } from "react";

import { ITeamView, useMyTeam } from "@/lib/data";
import { ME } from "@/lib/pace";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";

import { SETUP_KEYS } from "../constants";

const DEFAULT_SIZE = 5;

// A equipe que o onboarding mostra. Escolheu correr sozinho: nenhuma. Na
// prévia por link, a equipe recém-"criada" aparece só com você (capitão) e
// as vagas livres, em vez da equipe de exemplo já cheia.
export const useSetupTeam = (): ITeamView | null => {
	const { team } = useMyTeam();
	const isSolo = useStore((s) => s.answers[SETUP_KEYS.solo]) === "1";
	const draft = useStore((s) => s.answers[SETUP_KEYS.teamName]);
	const size = Number(useStore((s) => s.answers[SETUP_KEYS.teamSize]) ?? DEFAULT_SIZE);

	return useMemo(() => {
		if (isSolo) return null;
		if (!IS_PREVIEW || !draft || !team) return team ?? null;
		return {
			...team,
			name: draft,
			size: size || DEFAULT_SIZE,
			logoUrl: null,
			inviteCode: "PACE7K2Q",
			invites: [],
			members: [{ name: ME.name, role: "Capitão", km: 0, pts: 0, you: true }],
		};
	}, [isSolo, draft, size, team]);
};
