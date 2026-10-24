import { ImageSourcePropType } from "react-native";

import { useQuery } from "@tanstack/react-query";

import { ONLINE } from "@/lib/pace";
import { getTeamOnline } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

export interface ITeamOnlineView {
	id: string;
	name: string;
	// Só na prévia (fotos do design); atletas reais aparecem com as iniciais
	image?: ImageSourcePropType;
}

interface IUseTeamOnlineReturn {
	mates: ITeamOnlineView[];
	isLoading: boolean;
}

const REFRESH_MS = 60_000;

const DEMO_MATES: ITeamOnlineView[] = ONLINE.map((f) => ({
	id: f.name,
	name: f.name,
	image: f.image,
}));

// Colegas de equipe com o app aberto nos últimos 15 minutos.
export const useTeamOnline = (): IUseTeamOnlineReturn => {
	const query = useQuery({
		queryKey: DATA_KEYS.teamOnline,
		queryFn: getTeamOnline,
		enabled: !IS_PREVIEW,
		refetchInterval: REFRESH_MS,
	});

	if (IS_PREVIEW) return { mates: DEMO_MATES, isLoading: false };
	return {
		mates: (query.data ?? []).map((m) => ({ id: m.id, name: m.name || "Atleta" })),
		isLoading: query.isLoading,
	};
};
