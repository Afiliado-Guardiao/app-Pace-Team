import { useQuery } from "@tanstack/react-query";

import { getMyPro, IMyPro } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

interface IUseMyProReturn {
	pro: IMyPro | null;
	isPro: boolean;
	isLoading: boolean;
	refresh: () => Promise<unknown>;
}

// Prévia por link: capitão de uma equipe ainda no Free (mostra o convite ao Pro)
const DEMO_PRO: IMyPro = {
	isPro: false,
	teamPro: false,
	teamId: "demo",
	teamName: "Pace Sharks",
	isCaptain: true,
	isPayer: false,
	payerName: null,
	members: 7,
	covered: 7,
	limit: 10,
	productId: null,
	status: null,
	expiresAt: null,
	endsAt: null,
	hasOwnSub: false,
	ownSubTeamId: null,
	ownSubTeamName: null,
};

// PACE TEAM PRO do atleta logado. Só o servidor libera (compra confirmada).
export const useMyPro = (): IUseMyProReturn => {
	const query = useQuery({
		queryKey: DATA_KEYS.myPro,
		queryFn: getMyPro,
		enabled: !IS_PREVIEW,
		staleTime: 60_000,
	});
	if (IS_PREVIEW) {
		return { pro: DEMO_PRO, isPro: false, isLoading: false, refresh: () => Promise.resolve() };
	}
	return {
		pro: query.data ?? null,
		isPro: Boolean(query.data?.isPro),
		isLoading: query.isLoading,
		refresh: query.refetch,
	};
};
