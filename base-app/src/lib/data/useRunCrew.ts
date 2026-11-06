import { useQuery } from "@tanstack/react-query";

import { avatarUrlOf, getRunCrew, ICrewRunnerRow } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

// Quem correu junto, pronto para desenhar (foto já como endereço)
export interface ICrewRunner {
	userId: string;
	name: string;
	photo: string | null;
	isOwner: boolean;
	isYou: boolean;
	isLive: boolean;
	km: number;
	seconds: number;
	// Desenho do percurso (graus relativos ao ponto comum de todos)
	shape: [number, number][];
}

interface IUseRunCrewReturn {
	runners: ICrewRunner[];
	isLoading: boolean;
}

// Enquanto alguém ainda corre, busca de novo: os números viram os finais
const LIVE_REFRESH_MS = 10_000;

export const toCrewRunner = (r: ICrewRunnerRow): ICrewRunner => ({
	userId: r.userId,
	name: r.name,
	photo: r.avatarPath ? avatarUrlOf(r.avatarPath) : null,
	isOwner: r.isOwner,
	isYou: r.isYou,
	isLive: r.isLive,
	km: r.meters / 1000,
	seconds: r.seconds,
	shape: r.shape,
});

// Todos que correram junto numa corrida (uma fonte só para compartilhar,
// postar e o detalhe; o feed recebe a mesma lista no próprio post)
export const useRunCrew = (runId: string | undefined): IUseRunCrewReturn => {
	const query = useQuery({
		queryKey: DATA_KEYS.runCrew(runId ?? ""),
		queryFn: () => getRunCrew(runId ?? ""),
		enabled: Boolean(runId) && !IS_PREVIEW,
		refetchInterval: (q) => (q.state.data?.some((r) => r.isLive) ? LIVE_REFRESH_MS : false),
	});
	return { runners: (query.data ?? []).map(toCrewRunner), isLoading: query.isLoading };
};
