import { useCallback } from "react";

import { useQuery } from "@tanstack/react-query";

import { getMyTeam } from "@/lib/supabase";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";
import { DEMO_TEAM_VIEW, ITeamView, toTeamView } from "./teamView";

interface IUseMyTeamReturn {
	team: ITeamView | null;
	isLoading: boolean;
	refetch: () => void;
}

const fetchMyTeam = async (): Promise<ITeamView | null> => {
	if (IS_PREVIEW) return DEMO_TEAM_VIEW;
	const team = await getMyTeam();
	if (!team) return null;
	const view = toTeamView(team);
	// Minha foto já está no aparelho: usa ela se o servidor não mandou
	const myPhoto = useStore.getState().user?.avatarUrl ?? null;
	return {
		...view,
		members: view.members.map((m) => (m.you && !m.avatarUrl ? { ...m, avatarUrl: myPhoto } : m)),
	};
};

// Minha equipe (null = ainda sem time).
export const useMyTeam = (): IUseMyTeamReturn => {
	const query = useQuery({ queryKey: DATA_KEYS.myTeam, queryFn: fetchMyTeam });
	const queryRefetch = query.refetch;
	// Estável: pode ir nas dependências de efeitos (ex.: recarregar ao focar)
	const refetch = useCallback(() => {
		void queryRefetch();
	}, [queryRefetch]);

	return { team: query.data ?? null, isLoading: query.isLoading, refetch };
};
