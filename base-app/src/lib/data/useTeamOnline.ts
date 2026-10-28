import { useCallback } from "react";
import { ImageSourcePropType } from "react-native";

import { useQuery } from "@tanstack/react-query";

import { ONLINE } from "@/lib/pace";
import { avatarUrlOf, getTeamOnline } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

export interface ITeamOnlineView {
	id: string;
	name: string;
	// Foto do perfil (sem foto, as iniciais)
	image?: ImageSourcePropType;
}

interface IUseTeamOnlineReturn {
	mates: ITeamOnlineView[];
	isLoading: boolean;
	refetch: () => void;
}

const REFRESH_MS = 30_000;

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

	const refetch = query.refetch;
	const reload = useCallback(() => {
		void refetch();
	}, [refetch]);

	if (IS_PREVIEW) return { mates: DEMO_MATES, isLoading: false, refetch: reload };
	return {
		mates: (query.data ?? []).map((m) => ({
			id: m.id,
			name: m.name || "Atleta",
			image: m.avatarPath ? { uri: avatarUrlOf(m.avatarPath) } : undefined,
		})),
		isLoading: query.isLoading,
		refetch: reload,
	};
};
